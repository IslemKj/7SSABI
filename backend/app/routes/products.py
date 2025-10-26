"""
Routes pour la gestion des produits/services
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, Product
from ..schemas import ProductCreate, ProductUpdate, ProductResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer la liste des produits/services
    """
    query = db.query(Product).filter(Product.user_id == current_user.id)
    
    if category:
        query = query.filter(Product.category == category)
    
    products = query.offset(skip).limit(limit).all()
    
    return products


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
    print(f"DEBUG - Price value: {product_dict.get('price')} (type: {type(product_dict.get('price'))})")
    
    # Mapper les champs
    db_data = {
        'name': product_dict['name'],
        'description': product_dict.get('description'),
        'unit_price': product_dict.get('price', 0),
        'tva_rate': product_dict.get('tva_rate', 19),
        'category': product_dict.get('category', 'produit'),
        'is_service': product_dict.get('category') == 'service',
        'stock': 0,  # Par défaut
        'user_id': current_user.id
    }
    
    print(f"DEBUG - DB Data: {db_data}")
    
    product = Product(**db_data)
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
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
    print(f"DEBUG UPDATE - Price value: {update_dict.get('price')} (type: {type(update_dict.get('price'))})")
    
    if 'price' in update_dict:
        product.unit_price = update_dict['price']
    if 'name' in update_dict:
        product.name = update_dict['name']
    if 'description' in update_dict:
        product.description = update_dict['description']
    if 'tva_rate' in update_dict:
        product.tva_rate = update_dict['tva_rate']
    if 'category' in update_dict:
        product.category = update_dict['category']
        product.is_service = update_dict['category'] == 'service'
    
    db.commit()
    db.refresh(product)
    
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
