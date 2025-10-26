"""
Routes pour le tableau de bord (dashboard)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import List, Dict
from calendar import monthrange

from ..database import get_db
from ..models import User, Invoice, Expense, Client, Product, InvoiceItem
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


@router.get("/analytics/revenue-trend")
def get_revenue_trend(
    months: int = 12,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer l'évolution du CA sur les N derniers mois
    """
    today = date.today()
    data = []
    
    for i in range(months - 1, -1, -1):
        # Calculer le mois cible
        target_date = today - timedelta(days=i * 30)
        year = target_date.year
        month = target_date.month
        
        # CA du mois (factures payées uniquement)
        revenue = db.query(func.sum(Invoice.total_ttc)).filter(
            Invoice.user_id == current_user.id,
            Invoice.status == "paid",
            Invoice.is_quote == False,
            extract('year', Invoice.date) == year,
            extract('month', Invoice.date) == month
        ).scalar() or Decimal(0)
        
        # Dépenses du mois
        expenses = db.query(func.sum(Expense.amount)).filter(
            Expense.user_id == current_user.id,
            extract('year', Expense.date) == year,
            extract('month', Expense.date) == month
        ).scalar() or Decimal(0)
        
        # Nom du mois
        month_names = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
                       'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
        month_label = f"{month_names[month - 1]} {year}"
        
        data.append({
            "month": month_label,
            "revenue": float(revenue),
            "expenses": float(expenses),
            "profit": float(revenue - expenses)
        })
    
    return data


@router.get("/analytics/top-clients")
def get_top_clients(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les clients les plus rentables
    """
    top_clients = db.query(
        Client.id,
        Client.name,
        func.sum(Invoice.total_ttc).label('total_revenue'),
        func.count(Invoice.id).label('invoice_count')
    ).join(Invoice, Invoice.client_id == Client.id).filter(
        Client.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).group_by(Client.id, Client.name).order_by(
        func.sum(Invoice.total_ttc).desc()
    ).limit(limit).all()
    
    return [
        {
            "id": client.id,
            "name": client.name,
            "revenue": float(client.total_revenue),
            "invoice_count": client.invoice_count
        }
        for client in top_clients
    ]


@router.get("/analytics/top-products")
def get_top_products(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les produits/services les plus vendus
    """
    top_products = db.query(
        Product.id,
        Product.name,
        Product.category,
        func.sum(InvoiceItem.quantity).label('total_quantity'),
        func.sum(InvoiceItem.quantity * InvoiceItem.unit_price).label('total_revenue')
    ).join(InvoiceItem, InvoiceItem.product_id == Product.id).join(
        Invoice, Invoice.id == InvoiceItem.invoice_id
    ).filter(
        Product.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).group_by(
        Product.id, Product.name, Product.category
    ).order_by(
        func.sum(InvoiceItem.quantity * InvoiceItem.unit_price).desc()
    ).limit(limit).all()
    
    return [
        {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "quantity": int(product.total_quantity or 0),
            "revenue": float(product.total_revenue or 0)
        }
        for product in top_products
    ]


@router.get("/analytics/kpis")
def get_kpis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les indicateurs de performance clés
    """
    # Mois actuel et mois précédent
    today = date.today()
    current_month_start = date(today.year, today.month, 1)
    
    if today.month == 1:
        prev_month = 12
        prev_year = today.year - 1
    else:
        prev_month = today.month - 1
        prev_year = today.year
    
    prev_month_start = date(prev_year, prev_month, 1)
    prev_month_end = date(prev_year, prev_month, monthrange(prev_year, prev_month)[1])
    
    # CA mois actuel
    current_revenue = db.query(func.sum(Invoice.total_ttc)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False,
        Invoice.date >= current_month_start
    ).scalar() or Decimal(0)
    
    # CA mois précédent
    prev_revenue = db.query(func.sum(Invoice.total_ttc)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False,
        Invoice.date >= prev_month_start,
        Invoice.date <= prev_month_end
    ).scalar() or Decimal(0)
    
    # Calcul de la croissance
    growth = 0
    if prev_revenue > 0:
        growth = float(((current_revenue - prev_revenue) / prev_revenue) * 100)
    
    # Ticket moyen
    avg_invoice = db.query(func.avg(Invoice.total_ttc)).filter(
        Invoice.user_id == current_user.id,
        Invoice.status == "paid",
        Invoice.is_quote == False
    ).scalar() or Decimal(0)
    
    # Taux de conversion devis -> factures
    total_quotes = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.is_quote == True
    ).scalar() or 0
    
    converted_quotes = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == current_user.id,
        Invoice.is_quote == True,
        Invoice.status == "paid"
    ).scalar() or 0
    
    conversion_rate = 0
    if total_quotes > 0:
        conversion_rate = (converted_quotes / total_quotes) * 100
    
    return {
        "current_month_revenue": float(current_revenue),
        "previous_month_revenue": float(prev_revenue),
        "growth_percentage": round(growth, 2),
        "average_invoice": float(avg_invoice),
        "conversion_rate": round(conversion_rate, 2)
    }
