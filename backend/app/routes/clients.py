"""
Routes pour la gestion des clients
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List
import csv
import io
import math

from ..database import get_db
from ..models import User, Client
from ..schemas import ClientCreate, ClientUpdate, ClientResponse, PaginatedResponse
from ..utils.auth import get_current_user
from ..utils.notifications import create_client_notification

router = APIRouter(prefix="/api/clients", tags=["Clients"])


@router.get("/", response_model=PaginatedResponse[ClientResponse])
def get_clients(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer la liste des clients avec pagination
    """
    # Calculer skip
    skip = (page - 1) * page_size
    
    # Compter le total
    total = db.query(Client).filter(
        Client.user_id == current_user.id
    ).count()
    
    # Récupérer les clients
    clients = db.query(Client).filter(
        Client.user_id == current_user.id
    ).offset(skip).limit(page_size).all()
    
    # Calculer le nombre total de pages
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "items": clients,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer un client par son ID
    """
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client non trouvé"
        )
    
    return client


@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    client_data: ClientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Créer un nouveau client
    """
    client = Client(
        **client_data.model_dump(),
        user_id=current_user.id
    )
    
    db.add(client)
    db.commit()
    db.refresh(client)
    
    # Créer une notification
    create_client_notification(
        db=db,
        user_id=current_user.id,
        client_name=client.name
    )
    
    return client


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un client
    """
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client non trouvé"
        )
    
    # Mettre à jour les champs
    update_data = client_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.commit()
    db.refresh(client)
    
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer un client
    """
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client non trouvé"
        )
    
    db.delete(client)
    db.commit()
    
    return None


@router.post("/import-csv", status_code=status.HTTP_201_CREATED)
async def import_clients_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Importer des clients depuis un fichier CSV
    Format attendu: name,email,phone,address,nif,rc_number
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier doit être au format CSV"
        )
    
    try:
        # Lire le contenu du fichier
        contents = await file.read()
        decoded = contents.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(decoded))
        
        created_count = 0
        errors = []
        
        for row_num, row in enumerate(csv_reader, start=2):
            try:
                # Créer le client
                client = Client(
                    user_id=current_user.id,
                    name=row.get('name', '').strip(),
                    email=row.get('email', '').strip() or None,
                    phone=row.get('phone', '').strip() or None,
                    address=row.get('address', '').strip() or None,
                    nif=row.get('nif', '').strip() or None,
                    rc_number=row.get('rc_number', '').strip() or None,
                    company_name=row.get('company_name', '').strip() or None
                )
                
                if not client.name:
                    errors.append(f"Ligne {row_num}: Le nom est obligatoire")
                    continue
                
                db.add(client)
                created_count += 1
                
            except Exception as e:
                errors.append(f"Ligne {row_num}: {str(e)}")
        
        db.commit()
        
        return {
            "success": True,
            "created_count": created_count,
            "errors": errors,
            "message": f"{created_count} client(s) importé(s) avec succès"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de l'import: {str(e)}"
        )
