"""
Routes pour la gestion des factures
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from decimal import Decimal
from datetime import date, datetime
import os
import json

from ..database import get_db
from ..models import User, Invoice, InvoiceItem, Client, Product
from ..schemas import InvoiceCreate, InvoiceUpdate, InvoiceResponse
from ..utils.auth import get_current_user
from ..utils.pdf_generator import generate_invoice_pdf

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


def generate_invoice_number(db: Session, user_id: int) -> str:
    """Générer un numéro de facture unique"""
    # Compter les factures de l'utilisateur
    count = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id,
        Invoice.is_quote == False
    ).scalar()
    
    year = datetime.now().year
    return f"FA-{year}-{count + 1:05d}"


def generate_quote_number(db: Session, user_id: int) -> str:
    """Générer un numéro de devis unique"""
    count = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id,
        Invoice.is_quote == True
    ).scalar()
    
    year = datetime.now().year
    return f"DEV-{year}-{count + 1:05d}"


@router.get("/", response_model=List[InvoiceResponse])
def get_invoices(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    is_quote: bool = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer la liste des factures/devis
    """
    query = db.query(Invoice).filter(Invoice.user_id == current_user.id)
    
    if status:
        query = query.filter(Invoice.status == status)
    
    if is_quote is not None:
        query = query.filter(Invoice.is_quote == is_quote)
    
    invoices = query.order_by(Invoice.date.desc()).offset(skip).limit(limit).all()
    
    return invoices


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer une facture par son ID
    """
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture non trouvée"
        )
    
    return invoice


@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice_data: InvoiceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Créer une nouvelle facture/devis
    """
    # Vérifier que le client existe
    client = db.query(Client).filter(
        Client.id == invoice_data.client_id,
        Client.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client non trouvé"
        )
    
    # Générer le numéro de facture
    if invoice_data.is_quote:
        invoice_number = generate_quote_number(db, current_user.id)
    else:
        invoice_number = generate_invoice_number(db, current_user.id)
    
    # Calculer les totaux
    total_ht = Decimal(0)
    total_tva = Decimal(0)
    
    for item in invoice_data.items:
        item_total = Decimal(str(item.unit_price)) * Decimal(str(item.quantity))
        total_ht += item_total
        
        # Calculer la TVA de chaque ligne si tva_rate est fourni
        if hasattr(item, 'tva_rate') and item.tva_rate is not None:
            item_tva = item_total * (Decimal(str(item.tva_rate)) / Decimal(100))
            total_tva += item_tva
    
    total_ttc = total_ht + total_tva
    
    # Déterminer le tva_rate global (pour compatibilité avec le modèle)
    # On utilise le taux du premier item ou le taux par défaut de invoice_data
    global_tva_rate = Decimal(19)  # Défaut
    if hasattr(invoice_data, 'tva_rate') and invoice_data.tva_rate is not None:
        global_tva_rate = Decimal(str(invoice_data.tva_rate))
    elif invoice_data.items and hasattr(invoice_data.items[0], 'tva_rate') and invoice_data.items[0].tva_rate is not None:
        global_tva_rate = Decimal(str(invoice_data.items[0].tva_rate))
    
    # Créer la facture
    # Déterminer le statut par défaut selon le type (devis ou facture)
    default_status = 'draft' if invoice_data.is_quote else 'unpaid'
    invoice_status = invoice_data.status if hasattr(invoice_data, 'status') and invoice_data.status else default_status
    
    invoice = Invoice(
        user_id=current_user.id,
        client_id=invoice_data.client_id,
        invoice_number=invoice_number,
        date=invoice_data.date,
        due_date=invoice_data.due_date,
        total_ht=total_ht,
        tva_rate=global_tva_rate,
        tva_amount=total_tva,
        total_ttc=total_ttc,
        notes=invoice_data.notes,
        is_quote=invoice_data.is_quote,
        status=invoice_status
    )
    
    db.add(invoice)
    db.flush()  # Pour obtenir l'ID
    
    # Créer les lignes de facture
    for item_data in invoice_data.items:
        total_item = Decimal(str(item_data.unit_price)) * Decimal(str(item_data.quantity))
        
        item = InvoiceItem(
            invoice_id=invoice.id,
            product_id=item_data.product_id,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=Decimal(str(item_data.unit_price)),
            total=total_item
        )
        db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une facture
    """
    # Lire le body brut pour voir ce qui est envoyé
    body = await request.json()
    print(f"📥 Body brut reçu pour facture {invoice_id}:")
    print(json.dumps(body, indent=2, ensure_ascii=False))
    
    # Essayer de parser avec InvoiceUpdate
    try:
        invoice_data = InvoiceUpdate(**body)
        print(f"✅ Parsing réussi!")
    except Exception as e:
        print(f"❌ Erreur parsing: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Erreur de validation: {str(e)}"
        )
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture non trouvée"
        )
    
    # Mettre à jour les champs (sauf items qui sera géré séparément)
    update_data = invoice_data.model_dump(exclude_unset=True, exclude={'items'})
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    # Gérer la mise à jour des items si fournis
    if invoice_data.items is not None:
        # Supprimer les anciens items
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
        
        # Ajouter les nouveaux items
        for item_data in invoice_data.items:
            # Calculer le total pour cette ligne
            total = item_data.quantity * item_data.unit_price
            
            item = InvoiceItem(
                invoice_id=invoice_id,
                product_id=item_data.product_id,
                description=item_data.description,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                total=total
            )
            db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    return invoice


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer une facture
    """
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture non trouvée"
        )
    
    db.delete(invoice)
    db.commit()
    
    return None


@router.get("/{invoice_id}/pdf")
def download_invoice_pdf(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Télécharger le PDF d'une facture
    """
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture non trouvée"
        )
    
    # Préparer les données
    user_data = {
        'entreprise_name': current_user.entreprise_name or current_user.name,
        'address': current_user.address,
        'nif': current_user.nif,
        'phone': current_user.phone
    }
    
    client_data = {
        'name': invoice.client.name,
        'address': invoice.client.address,
        'nif': invoice.client.nif
    }
    
    invoice_data_dict = {
        'invoice_number': invoice.invoice_number,
        'date': invoice.date,
        'due_date': invoice.due_date,
        'is_quote': invoice.is_quote,
        'total_ht': invoice.total_ht,
        'tva_rate': invoice.tva_rate,
        'tva_amount': invoice.tva_amount,
        'total_ttc': invoice.total_ttc,
        'notes': invoice.notes
    }
    
    items = [
        {
            'description': item.description,
            'quantity': item.quantity,
            'unit_price': item.unit_price,
            'total': item.total
        }
        for item in invoice.items
    ]
    
    # Générer le PDF
    pdf_path = generate_invoice_pdf(
        invoice_data_dict,
        user_data,
        client_data,
        items,
        output_dir="invoices"
    )
    
    # Mettre à jour l'URL du PDF
    invoice.pdf_url = pdf_path
    db.commit()
    
    return FileResponse(
        path=pdf_path,
        filename=f"{invoice.invoice_number}.pdf",
        media_type="application/pdf"
    )


@router.post("/{quote_id}/convert-to-invoice", response_model=InvoiceResponse)
def convert_quote_to_invoice(
    quote_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convertir un devis en facture
    """
    quote = db.query(Invoice).filter(
        Invoice.id == quote_id,
        Invoice.user_id == current_user.id,
        Invoice.is_quote == True
    ).first()
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Devis non trouvé"
        )
    
    # Créer une nouvelle facture basée sur le devis
    invoice_number = generate_invoice_number(db, current_user.id)
    
    invoice = Invoice(
        user_id=current_user.id,
        client_id=quote.client_id,
        invoice_number=invoice_number,
        date=date.today(),
        due_date=quote.due_date,
        total_ht=quote.total_ht,
        tva_rate=quote.tva_rate,
        tva_amount=quote.tva_amount,
        total_ttc=quote.total_ttc,
        notes=quote.notes,
        is_quote=False
    )
    
    db.add(invoice)
    db.flush()
    
    # Copier les lignes du devis
    for quote_item in quote.items:
        item = InvoiceItem(
            invoice_id=invoice.id,
            product_id=quote_item.product_id,
            description=quote_item.description,
            quantity=quote_item.quantity,
            unit_price=quote_item.unit_price,
            total=quote_item.total
        )
        db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    return invoice
