"""
Script pour initialiser la base de données sur Railway
À exécuter via Railway CLI ou le terminal Railway
"""
import sys
import os

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import create_tables, engine
from app.models import user, client, product, invoice, expense, notification

def init_database():
    """Initialiser la base de données"""
    try:
        print("🔄 Connexion à la base de données...")
        print(f"Database URL: {engine.url}")
        
        print("🔄 Création des tables...")
        create_tables()
        
        print("✅ Base de données initialisée avec succès!")
        print("\nTables créées:")
        print("- users")
        print("- clients") 
        print("- products")
        print("- invoices")
        print("- invoice_items")
        print("- expenses")
        print("- notifications")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
