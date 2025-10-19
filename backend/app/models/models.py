"""
Modèles de base de données
"""
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    """Modèle utilisateur (micro-entrepreneur)"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    entreprise_name = Column(String(200))
    nif = Column(String(50))  # Numéro d'Identification Fiscale
    address = Column(Text)
    phone = Column(String(20))
    logo_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relations
    clients = relationship("Client", back_populates="user", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="user", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")


class Client(Base):
    """Modèle client"""
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    company_name = Column(String(200))
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(Text)
    nif = Column(String(50))  # NIF du client
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="clients")
    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")


class Product(Base):
    """Modèle produit/service"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    unit_price = Column(Numeric(10, 2), nullable=False)
    tva_rate = Column(Numeric(5, 2), default=19.0, nullable=False)  # Taux TVA en %
    category = Column(String(100))
    stock = Column(Integer, default=0)
    is_service = Column(Boolean, default=False)  # True = service, False = produit
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="products")
    invoice_items = relationship("InvoiceItem", back_populates="product")


class Invoice(Base):
    """Modèle facture"""
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    due_date = Column(Date)
    total_ht = Column(Numeric(10, 2), nullable=False)  # Total Hors Taxes
    tva_rate = Column(Numeric(5, 2), default=19.0)  # Taux de TVA (19%, 9%, 0%)
    tva_amount = Column(Numeric(10, 2), default=0.0)  # Montant TVA
    total_ttc = Column(Numeric(10, 2), nullable=False)  # Total TTC
    status = Column(String(20), default="unpaid")  # unpaid, paid, partial, cancelled
    paid_amount = Column(Numeric(10, 2), default=0.0)
    notes = Column(Text)
    pdf_url = Column(String(255))
    is_quote = Column(Boolean, default=False)  # True = devis, False = facture
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="invoices")
    client = relationship("Client", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    """Lignes de facture"""
    __tablename__ = "invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    description = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    
    # Relations
    invoice = relationship("Invoice", back_populates="items")
    product = relationship("Product", back_populates="invoice_items")


class Expense(Base):
    """Modèle dépense"""
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)  # internet, transport, électricité, etc.
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text)
    receipt_url = Column(String(255))  # URL du reçu/justificatif
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="expenses")
