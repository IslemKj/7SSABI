"""
Routes pour la gestion des factures
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from decimal import Decimal
from datetime import date, datetime
import os
import json
import math

from ..database import get_db
from ..models import User, Invoice, InvoiceItem, Client, Product
from ..schemas import InvoiceCreate, InvoiceUpdate, InvoiceResponse, PaginatedResponse
from ..utils.auth import get_current_user
from ..utils.pdf_generator import generate_invoice_pdf
from ..utils.notifications import create_invoice_notification

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


def generate_invoice_number(db: Session, user_id: int) -> str:
    """Générer un numéro de facture unique"""
    year = datetime.now().year
    
    # Trouver le dernier numéro de facture de l'année en cours pour cet utilisateur
    last_invoice = db.query(Invoice).filter(
        Invoice.user_id == user_id,
        Invoice.is_quote == False,
        Invoice.invoice_number.like(f"FA-{year}-U{user_id}-%")
    ).order_by(Invoice.invoice_number.desc()).first()
    
    if last_invoice and last_invoice.invoice_number:
        # Extraire le numéro et incrémenter
        try:
            last_num = int(last_invoice.invoice_number.split('-')[-1])
            next_num = last_num + 1
        except (ValueError, IndexError):
            next_num = 1
    else:
        next_num = 1
    
    # Format: FA-2025-U3-00001 (avec l'ID utilisateur)
    return f"FA-{year}-U{user_id}-{next_num:05d}"


def generate_quote_number(db: Session, user_id: int) -> str:
    """Générer un numéro de devis unique"""
    year = datetime.now().year
    
    # Trouver le dernier numéro de devis de l'année en cours pour cet utilisateur
    last_quote = db.query(Invoice).filter(
        Invoice.user_id == user_id,
        Invoice.is_quote == True,
        Invoice.invoice_number.like(f"DEV-{year}-U{user_id}-%")
    ).order_by(Invoice.invoice_number.desc()).first()
    
    if last_quote and last_quote.invoice_number:
        # Extraire le numéro et incrémenter
        try:
            last_num = int(last_quote.invoice_number.split('-')[-1])
            next_num = last_num + 1
        except (ValueError, IndexError):
            next_num = 1
    else:
        next_num = 1
    
    # Format: DEV-2025-U3-00001 (avec l'ID utilisateur)
    return f"DEV-{year}-U{user_id}-{next_num:05d}"


@router.get("/", response_model=PaginatedResponse[InvoiceResponse])
def get_invoices(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    status: str = None,
    is_quote: bool = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer la liste des factures/devis avec pagination
    """
    skip = (page - 1) * page_size
    
    query = db.query(Invoice).filter(Invoice.user_id == current_user.id)
    
    if status:
        query = query.filter(Invoice.status == status)
    
    if is_quote is not None:
        query = query.filter(Invoice.is_quote == is_quote)
    
    total = query.count()
    invoices = query.order_by(Invoice.date.desc()).offset(skip).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "items": invoices,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


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
    
    # Utiliser le numéro de facture fourni ou en générer un nouveau
    if invoice_data.invoice_number:
        invoice_number = invoice_data.invoice_number
    elif invoice_data.is_quote:
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
    
    # Gérer le taux de change et le total en DZD
    if invoice_data.currency == 'DZD':
        exchange_rate = Decimal(1)
    else:
        if not hasattr(invoice_data, 'exchange_rate') or invoice_data.exchange_rate is None or Decimal(invoice_data.exchange_rate) <= 0:
            raise HTTPException(status_code=400, detail="Exchange rate is required and must be > 0 for non-DZD invoices.")
        exchange_rate = Decimal(invoice_data.exchange_rate)
    total_dzd = total_ttc * exchange_rate

    invoice = Invoice(
        user_id=current_user.id,
        client_id=invoice_data.client_id,
        invoice_number=invoice_number,
        date=invoice_data.date,
        due_date=invoice_data.due_date,
        currency=invoice_data.currency,
        language=invoice_data.language,
        total_ht=total_ht,
        tva_rate=global_tva_rate,
        tva_amount=total_tva,
        total_ttc=total_ttc,
        notes=invoice_data.notes,
        is_quote=invoice_data.is_quote,
        status=invoice_status,
        exchange_rate=exchange_rate,
        total_dzd=total_dzd
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
    
    # Créer une notification
    create_invoice_notification(
        db=db,
        user_id=current_user.id,
        invoice_number=invoice.invoice_number,
        client_name=client.name,
        is_quote=invoice.is_quote
    )
    
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
        'rc_number': current_user.rc_number,
        'phone': current_user.phone,
        'logo_url': current_user.logo_url
    }
    
    client_data = {
        'name': invoice.client.name,
        'address': invoice.client.address,
        'nif': invoice.client.nif,
        'rc_number': invoice.client.rc_number
    }
    
    invoice_data_dict = {
        'invoice_number': invoice.invoice_number,
        'date': invoice.date,
        'due_date': invoice.due_date,
        'is_quote': invoice.is_quote,
        # Ajouter devise et langue pour que le PDF reflète le choix utilisateur
        'currency': invoice.currency,
        'language': invoice.language,
        'total_ht': invoice.total_ht,
        'tva_rate': invoice.tva_rate,
        'tva_amount': invoice.tva_amount,
        'total_ttc': invoice.total_ttc,
        'notes': invoice.notes
    }

    # DEBUG: affichage console pour vérifier passage des valeurs
    try:
        print("🧪 Génération PDF -> invoice_number:", invoice.invoice_number)
        print("   Devise utilisée:", invoice.currency)
        print("   Langue utilisée:", invoice.language)
    except Exception as _e:
        pass
    
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
        currency=quote.currency,  # Copier la devise
        language=quote.language,
        exchange_rate=quote.exchange_rate,  # Copier le taux de change
        total_dzd=quote.total_dzd,  # Copier le total en DZD
        total_ht=quote.total_ht,
        tva_rate=quote.tva_rate,
        tva_amount=quote.tva_amount,
        total_ttc=quote.total_ttc,
        notes=quote.notes,
        status="unpaid",  # Définir le statut comme non payé
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
    
    # Marquer le devis comme converti
    quote.status = "converted"
    
    db.commit()
    db.refresh(invoice)
    
    return invoice
