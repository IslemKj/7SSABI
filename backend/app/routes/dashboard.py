"""
Routes pour le tableau de bord (dashboard)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, date
from decimal import Decimal
from typing import List, Dict

from ..database import get_db
from ..models import User, Invoice, Expense, Client, Product
from ..schemas import DashboardStats
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les statistiques du tableau de bord
    """
    # Chiffre d'affaires (factures payées uniquement)
    total_revenue = db.query(func.sum(Invoice.total_ttc)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).scalar() or Decimal(0)
    
    # Total des dépenses
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id
    ).scalar() or Decimal(0)
    
    # Total clients
    total_clients = db.query(func.count(Client.id)).filter(
        Client.user_id == current_user.id
    ).scalar() or 0
    
    # Total factures (non devis)
    total_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.is_quote == False
    ).scalar() or 0
    
    # Factures payées
    paid_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).scalar() or 0
    
    # Factures en attente
    pending_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status.in_(["unpaid", "partial"]),
        Invoice.is_quote == False
    ).scalar() or 0
    
    # Total devis
    total_quotes = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.is_quote == True
    ).scalar() or 0
    
    return DashboardStats(
        total_revenue=float(total_revenue),
        total_expenses=float(total_expenses),
        total_clients=total_clients,
        total_invoices=total_invoices,
        paid_invoices=paid_invoices,
        pending_invoices=pending_invoices,
        total_quotes=total_quotes
    )


@router.get("/recent-activity")
def get_recent_activity(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer l'activité récente (factures et dépenses)
    """
    # Dernières factures
    recent_invoices = db.query(Invoice).filter(
        Invoice.user_id == current_user.id
    ).order_by(Invoice.created_at.desc()).limit(limit).all()
    
    # Dernières dépenses
    recent_expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).order_by(Expense.created_at.desc()).limit(limit).all()
    
    return {
        "recent_invoices": [
            {
                "id": inv.id,
                "invoice_number": inv.invoice_number,
                "client_name": inv.client.name,
                "total_ttc": float(inv.total_ttc),
                "status": inv.status,
                "date": inv.date.isoformat(),
                "is_quote": inv.is_quote
            }
            for inv in recent_invoices
        ],
        "recent_expenses": [
            {
                "id": exp.id,
                "category": exp.category,
                "amount": float(exp.amount),
                "date": exp.date.isoformat(),
                "description": exp.description
            }
            for exp in recent_expenses
        ]
    }
