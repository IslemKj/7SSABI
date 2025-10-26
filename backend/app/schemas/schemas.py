"""
Schémas Pydantic pour la validation des données
"""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from datetime import date as date_type
from decimal import Decimal


# ========== USER SCHEMAS ==========
class UserBase(BaseModel):
    """Schéma de base utilisateur"""
    name: str = Field(..., min_length=1, max_length=100, alias='full_name')
    email: EmailStr
    entreprise_name: Optional[str] = Field(None, alias='company_name')
    nif: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    
    model_config = ConfigDict(populate_by_name=True)


class UserCreate(UserBase):
    """Schéma pour créer un utilisateur"""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Schéma pour mettre à jour un utilisateur"""
    name: Optional[str] = None
    entreprise_name: Optional[str] = None
    nif: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(UserBase):
    """Schéma de réponse utilisateur"""
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== CLIENT SCHEMAS ==========
class ClientBase(BaseModel):
    """Schéma de base client"""
    name: str = Field(..., min_length=1, max_length=100)
    company_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    nif: Optional[str] = None


class ClientCreate(ClientBase):
    """Schéma pour créer un client"""
    pass


class ClientUpdate(BaseModel):
    """Schéma pour mettre à jour un client"""
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    nif: Optional[str] = None


class ClientResponse(ClientBase):
    """Schéma de réponse client"""
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== PRODUCT SCHEMAS ==========
class ProductBase(BaseModel):
    """Schéma de base produit"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0, alias='unit_price')
    tva_rate: Decimal = Field(default=19, ge=0, le=100)
    category: str = Field(default='produit')  # 'produit' ou 'service'
    
    model_config = ConfigDict(populate_by_name=True)


class ProductCreate(ProductBase):
    """Schéma pour créer un produit"""
    pass


class ProductUpdate(BaseModel):
    """Schéma pour mettre à jour un produit"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0, alias='unit_price')
    tva_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    category: Optional[str] = None
    
    model_config = ConfigDict(populate_by_name=True)


class ProductResponse(BaseModel):
    """Schéma de réponse produit"""
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    price: Decimal = Field(alias='unit_price')
    tva_rate: Decimal
    category: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# ========== INVOICE ITEM SCHEMAS ==========
class InvoiceItemBase(BaseModel):
    """Schéma de base ligne de facture"""
    product_id: Optional[int] = None
    description: str
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., gt=0)


class InvoiceItemCreate(InvoiceItemBase):
    """Schéma pour créer une ligne de facture"""
    pass


class InvoiceItemResponse(InvoiceItemBase):
    """Schéma de réponse ligne de facture"""
    id: int
    invoice_id: int
    total: Decimal
    
    model_config = ConfigDict(from_attributes=True)


# ========== INVOICE SCHEMAS ==========
class InvoiceBase(BaseModel):
    """Schéma de base facture"""
    client_id: int
    date: date_type
    due_date: Optional[date_type] = None
    tva_rate: Decimal = Field(default=19.0, ge=0, le=100)
    notes: Optional[str] = None
    is_quote: bool = False


class InvoiceCreate(InvoiceBase):
    """Schéma pour créer une facture"""
    items: List[InvoiceItemCreate]
    status: Optional[str] = Field(default="unpaid")


class InvoiceUpdate(BaseModel):
    """Schéma pour mettre à jour une facture"""
    client_id: Optional[int] = None
    invoice_number: Optional[str] = None
    date: Optional[date_type] = None
    due_date: Optional[date_type] = None
    status: Optional[str] = None
    paid_amount: Optional[Decimal] = None
    notes: Optional[str] = None
    total_ht: Optional[Decimal] = None
    total_tva: Optional[Decimal] = None
    total_ttc: Optional[Decimal] = None
    is_quote: Optional[bool] = None
    items: Optional[List[InvoiceItemCreate]] = None


class InvoiceResponse(InvoiceBase):
    """Schéma de réponse facture"""
    id: int
    user_id: int
    invoice_number: str
    total_ht: Decimal
    total_tva: Decimal = Field(alias='tva_amount')
    total_ttc: Decimal
    status: str
    paid_amount: Decimal
    pdf_url: Optional[str] = None
    items: List[InvoiceItemResponse]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# ========== EXPENSE SCHEMAS ==========
class ExpenseBase(BaseModel):
    """Schéma de base dépense"""
    category: str = Field(..., min_length=1, max_length=100)
    amount: Decimal = Field(..., gt=0)
    date: date_type
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    """Schéma pour créer une dépense"""
    pass


class ExpenseUpdate(BaseModel):
    """Schéma pour mettre à jour une dépense"""
    category: Optional[str] = None
    amount: Optional[Decimal] = Field(None, gt=0)
    date: Optional[date_type] = None
    description: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    """Schéma de réponse dépense"""
    id: int
    user_id: int
    receipt_url: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ========== AUTH SCHEMAS ==========
class Token(BaseModel):
    """Schéma pour le token JWT"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Données contenues dans le token"""
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    """Schéma pour la connexion"""
    username: EmailStr  # Frontend envoie 'username' qui contient l'email
    password: str


# ========== DASHBOARD SCHEMAS ==========
class DashboardStats(BaseModel):
    """Statistiques du tableau de bord"""
    total_revenue: float  # Chiffre d'affaires
    total_expenses: float  # Total dépenses
    total_clients: int  # Nombre de clients
    total_invoices: int  # Nombre de factures
    paid_invoices: int  # Factures payées
    pending_invoices: int  # Factures en attente
    total_quotes: int  # Nombre de devis
