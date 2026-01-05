import sqlite3
import os

# Chemin vers la base de données backend
db_path = os.path.join(os.path.dirname(__file__), '7ssabi.db')
print(f"Connexion à la base de données: {db_path}")

# Connexion à la base de données
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Ajouter la colonne language
    cursor.execute("""
        ALTER TABLE invoices 
        ADD COLUMN language VARCHAR(2) DEFAULT 'fr' NOT NULL
    """)
    conn.commit()
    print("✅ Colonne 'language' ajoutée avec succès!")
    
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("⚠️ La colonne 'language' existe déjà")
    else:
        print(f"❌ Erreur: {e}")

# Vérifier la structure de la table
cursor.execute("PRAGMA table_info(invoices)")
columns = cursor.fetchall()
print("\n📋 Colonnes de la table invoices:")
for col in columns:
    print(f"  - {col[1]} ({col[2]})")

# Vérifier si 'language' est présente
has_language = any(col[1] == 'language' for col in columns)
if has_language:
    print("\n✅ Colonne 'language' confirmée dans la table invoices")
else:
    print("\n❌ Colonne 'language' toujours absente!")

conn.close()
