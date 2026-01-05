"""
Script pour ajouter la colonne 'language' aux factures
"""
import sqlite3
import os

# Chemin vers la base de données
db_path = os.path.join(os.path.dirname(__file__), '7ssabi.db')

# Connexion à la base de données
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Ajouter la colonne language à la table invoices
    cursor.execute("""
        ALTER TABLE invoices 
        ADD COLUMN language VARCHAR(2) DEFAULT 'fr' NOT NULL
    """)
    conn.commit()
    print("✅ Colonne 'language' ajoutée à 'invoices'")
    
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("ℹ️  La colonne 'language' existe déjà dans 'invoices'")
    else:
        print(f"❌ Erreur: {e}")

finally:
    conn.close()

print("✅ Migration terminée")
