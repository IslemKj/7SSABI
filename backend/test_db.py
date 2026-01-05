"""Script de test pour vérifier l'accès à la base de données"""
import sys
import os

# Ajouter le répertoire backend au path
sys.path.insert(0, os.path.dirname(__file__))

print("✅ Import sys et os OK")

try:
    from app.database import engine
    print("✅ Import engine OK")
except Exception as e:
    print(f"❌ Erreur import engine: {e}")
    sys.exit(1)

try:
    from app.models.models import Invoice
    print("✅ Import modèles OK")
except Exception as e:
    print(f"❌ Erreur import modèles: {e}")
    sys.exit(1)

try:
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"✅ Tables dans la base de données: {tables}")
    
    if 'invoices' in tables:
        columns = inspector.get_columns('invoices')
        print("\n📋 Colonnes de la table invoices:")
        for col in columns:
            print(f"  - {col['name']} ({col['type']})")
        
        # Vérifier si language existe
        has_language = any(col['name'] == 'language' for col in columns)
        if has_language:
            print("\n✅ Colonne 'language' trouvée dans la base de données!")
        else:
            print("\n❌ Colonne 'language' manquante!")
    else:
        print("❌ Table 'invoices' n'existe pas!")
        
except Exception as e:
    print(f"❌ Erreur lors de l'inspection: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n✅ Tous les tests OK!")
