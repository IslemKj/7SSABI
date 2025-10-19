"""
Script pour créer toutes les tables de la base de données
"""
from app.database import engine, Base
from app.models import User, Client, Product, Invoice, InvoiceItem, Expense

print("Création des tables dans la base de données...")

try:
    # Créer toutes les tables définies dans les modèles
    Base.metadata.create_all(bind=engine)
    print("✓ Tables créées avec succès!")
    
    # Afficher les tables créées
    print("\nTables créées:")
    for table in Base.metadata.tables.keys():
        print(f"  - {table}")
        
except Exception as e:
    print(f"✗ Erreur lors de la création des tables: {e}")
