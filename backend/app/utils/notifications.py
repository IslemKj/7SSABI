"""
Utilitaires pour créer des notifications
"""
from sqlalchemy.orm import Session
from ..models import Notification


def create_notification(
    db: Session,
    user_id: int,
    notification_type: str,
    title: str,
    message: str,
    link: str = None
):
    """
    Créer une nouvelle notification pour un utilisateur
    """
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        link=link
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def create_invoice_notification(db: Session, user_id: int, invoice_number: str, client_name: str, is_quote: bool = False):
    """Notification pour création de facture/devis"""
    doc_type = "Devis" if is_quote else "Facture"
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="quote_created" if is_quote else "invoice_created",
        title=f"{doc_type} créé",
        message=f"{doc_type} {invoice_number} pour {client_name} a été créé avec succès",
        link="/invoices"
    )


def create_payment_notification(db: Session, user_id: int, invoice_number: str, amount: float):
    """Notification pour paiement reçu"""
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="payment_received",
        title="Paiement reçu",
        message=f"Paiement de {amount:,.2f} DA reçu pour la facture {invoice_number}",
        link="/invoices"
    )


def create_client_notification(db: Session, user_id: int, client_name: str):
    """Notification pour nouveau client"""
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="client_added",
        title="Nouveau client",
        message=f"Le client {client_name} a été ajouté à votre liste",
        link="/clients"
    )


def create_product_notification(db: Session, user_id: int, product_name: str):
    """Notification pour nouveau produit/service"""
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="product_added",
        title="Nouveau produit/service",
        message=f"{product_name} a été ajouté à votre catalogue",
        link="/products"
    )
