"""
Routes pour la gestion des produits/services
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import math

from ..database import get_db
from ..models import User, Product
from ..schemas import ProductCreate, ProductUpdate, ProductResponse, PaginatedResponse
from ..utils.auth import get_current_user
from ..utils.notifications import create_product_notification

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=PaginatedResponse[ProductResponse])
def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer la liste des produits/services avec pagination
    """
    skip = (page - 1) * page_size
    
    query = db.query(Product).filter(Product.user_id == current_user.id)
    
    if category:
        query = query.filter(Product.category == category)
    
    total = query.count()
    products = query.offset(skip).limit(page_size).all()
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "items": products,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer un produit par son ID
    """
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Créer un nouveau produit/service
    """
    # Convertir les données du schéma vers le modèle de base de données
    product_dict = product_data.model_dump(by_alias=False)
    
    # DEBUG: Afficher les données reçues
    print(f"DEBUG - Données reçues: {product_dict}")
    print(f"DEBUG - Unit price value: {product_dict.get('unit_price')} (type: {type(product_dict.get('unit_price'))})")
    
    # Mapper les champs
    db_data = {
        'name': product_dict['name'],
        'description': product_dict.get('description'),
        'unit_price': product_dict.get('unit_price', 0),
        'currency': product_dict.get('currency', 'EUR'),
        'tva_rate': product_dict.get('tva_rate', 19),
        'category': product_dict.get('category', 'produit'),
        'is_service': product_dict.get('category') == 'service',
        'stock': product_dict.get('stock', 0) if product_dict.get('category') == 'produit' else 0,
        'user_id': current_user.id
    }
    
    print(f"DEBUG - DB Data: {db_data}")
    
    product = Product(**db_data)
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    # Créer une notification
    create_product_notification(
        db=db,
        user_id=current_user.id,
        product_name=product.name
    )
    
    print(f"DEBUG - Product created: id={product.id}, unit_price={product.unit_price}")
    
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un produit/service
    """
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé"
        )
    
    # Convertir et mettre à jour les champs
    update_dict = product_data.model_dump(exclude_unset=True, by_alias=False)
    
    # DEBUG: Afficher les données de mise à jour
    print(f"DEBUG UPDATE - Données reçues: {update_dict}")
    print(f"DEBUG UPDATE - Unit price value: {update_dict.get('unit_price')} (type: {type(update_dict.get('unit_price'))})")

    if 'unit_price' in update_dict:
        product.unit_price = update_dict['unit_price']
    if 'name' in update_dict:
        product.name = update_dict['name']
    if 'description' in update_dict:
        product.description = update_dict['description']
    if 'tva_rate' in update_dict:
        product.tva_rate = update_dict['tva_rate']
    if 'category' in update_dict:
        product.category = update_dict['category']
        product.is_service = update_dict['category'] == 'service'
    if 'currency' in update_dict:
        product.currency = update_dict['currency']
    if 'stock' in update_dict:
        product.stock = update_dict['stock'] if product.category == 'produit' else 0
    
    db.commit()
    db.refresh(product)
    print(f"DEBUG AFTER COMMIT - Product id={product.id}, unit_price={product.unit_price}")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer un produit/service
    """
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé"
        )
    
    db.delete(product)
    db.commit()
    
    return None
