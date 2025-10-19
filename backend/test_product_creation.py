"""
Script pour tester la création de produit directement
"""
import sys
import json
from app.database import SessionLocal
from app.models import User, Product
from decimal import Decimal

db = SessionLocal()

try:
    # Vérifier qu'un utilisateur existe
    user = db.query(User).first()
    if not user:
        print("✗ Aucun utilisateur trouvé. Créez d'abord un utilisateur.")
        sys.exit(1)
    
    print(f"✓ Utilisateur trouvé: {user.email}")
    
    # Tester la création d'un produit
    test_data = {
        'name': 'Produit Test',
        'description': 'Description test',
        'unit_price': Decimal('100.00'),
        'tva_rate': Decimal('19.00'),
        'category': 'produit',
        'is_service': False,
        'stock': 0,
        'user_id': user.id
    }
    
    print("\nDonnées à insérer:")
    print(json.dumps({k: str(v) for k, v in test_data.items()}, indent=2))
    
    product = Product(**test_data)
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    print(f"\n✓ Produit créé avec succès!")
    print(f"  ID: {product.id}")
    print(f"  Nom: {product.name}")
    print(f"  Prix HT: {product.unit_price}")
    print(f"  TVA: {product.tva_rate}%")
    print(f"  Catégorie: {product.category}")
    
except Exception as e:
    print(f"\n✗ Erreur: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
