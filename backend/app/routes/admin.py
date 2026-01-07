"""
Routes pour l'administration des utilisateurs
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import math

from ..database import get_db
from ..models import User, Invoice, Client, Product, Expense
from ..models.contact_request import ContactRequest
from ..schemas import UserResponse, UserStats, PaginatedResponse
from ..utils.admin import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users/", response_model=PaginatedResponse[UserResponse])
def get_all_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: str = Query(None, description="Search by name or email"),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les utilisateurs (admin uniquement)
    """
    skip = (page - 1) * page_size
    
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | 
            (User.email.ilike(f"%{search}%"))
        )
    
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset(skip).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "items": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get("/users/{user_id}/stats", response_model=UserStats)
def get_user_stats(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les statistiques d'un utilisateur
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Compter les factures
    invoice_count = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id
    ).scalar()
    
    # Calculer le revenu total en DZD (factures payées uniquement, sans devis)
    total_revenue = db.query(func.sum(Invoice.total_dzd)).filter(
        Invoice.user_id == user_id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).scalar() or 0
    
    # Compter les clients
    client_count = db.query(func.count(Client.id)).filter(
        Client.user_id == user_id
    ).scalar()
    
    # Compter les produits
    product_count = db.query(func.count(Product.id)).filter(
        Product.user_id == user_id
    ).scalar()
    
    # Compter les dépenses
    expense_count = db.query(func.count(Expense.id)).filter(
        Expense.user_id == user_id
    ).scalar()
    
    return {
        "user_id": user.id,
        "user_name": user.name,
        "user_email": user.email,
        "invoice_count": invoice_count,
        "total_revenue": float(total_revenue),
        "client_count": client_count,
        "product_count": product_count,
        "expense_count": expense_count,
        "is_active": user.is_active,
        "role": user.role,
        "created_at": user.created_at
    }


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Activer/désactiver un utilisateur
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Empêcher la désactivation du propre compte admin
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas désactiver votre propre compte"
        )
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": f"Utilisateur {'activé' if user.is_active else 'désactivé'} avec succès",
        "is_active": user.is_active
    }


@router.patch("/users/{user_id}/make-admin")
def make_user_admin(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Promouvoir un utilisateur en administrateur
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    user.role = "admin"
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": "Utilisateur promu administrateur avec succès",
        "role": user.role
    }


@router.patch("/users/{user_id}/remove-admin")
def remove_user_admin(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Retirer les droits administrateur d'un utilisateur
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Empêcher de retirer ses propres droits admin
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas retirer vos propres droits administrateur"
        )
    
    user.role = "user"
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": "Droits administrateur retirés avec succès",
        "role": user.role
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer un utilisateur (avec toutes ses données)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Empêcher la suppression de son propre compte
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )
    
    db.delete(user)
    db.commit()
    
    return {
        "success": True,
        "message": "Utilisateur supprimé avec succès"
    }


@router.get("/contact-requests/")
def get_contact_requests(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    unprocessed_only: bool = Query(False),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all contact/demo requests (admin only)
    """
    skip = (page - 1) * page_size
    
    query = db.query(ContactRequest)
    if unprocessed_only:
        query = query.filter(ContactRequest.is_processed == False)
    
    total = query.count()
    requests = query.order_by(ContactRequest.created_at.desc()).offset(skip).limit(page_size).all()
    
    return {
        "items": [
            {
                "id": r.id,
                "email": r.email,
                "name": r.name,
                "subject": r.subject,
                "message": r.message,
                "request_type": r.request_type,
                "created_at": r.created_at,
                "is_processed": r.is_processed,
                "notes": r.notes
            }
            for r in requests
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0
    }


@router.patch("/contact-requests/{request_id}/process")
def mark_request_processed(
    request_id: int,
    notes: str = None,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Mark a contact request as processed (admin only)
    """
    contact = db.query(ContactRequest).filter(ContactRequest.id == request_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Request not found")
    
    contact.is_processed = True
    if notes:
        contact.notes = notes
    db.commit()
    
    return {"success": True, "message": "Request marked as processed"}
