"""
Script pour ajouter la colonne tva_rate à la table products
"""
import sqlite3
import os

# Chemin vers la base de données
db_path = os.path.join(os.path.dirname(__file__), 'app.db')

print(f"Connexion à la base de données: {db_path}")

try:
    # Connexion à la base de données
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Vérifier si la colonne existe déjà
    cursor.execute("PRAGMA table_info(products)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'tva_rate' in columns:
        print("✓ La colonne 'tva_rate' existe déjà dans la table 'products'")
    else:
        print("Ajout de la colonne 'tva_rate' à la table 'products'...")
        # Ajouter la colonne avec une valeur par défaut de 19%
        cursor.execute("""
            ALTER TABLE products 
            ADD COLUMN tva_rate NUMERIC(5, 2) DEFAULT 19.0 NOT NULL
        """)
        conn.commit()
        print("✓ Colonne 'tva_rate' ajoutée avec succès!")
    
    # Vérifier les données
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    print(f"✓ Nombre de produits dans la base: {count}")
    
    conn.close()
    print("\n✓ Migration terminée avec succès!")
    
except Exception as e:
    print(f"✗ Erreur lors de la migration: {e}")
    if conn:
        conn.close()
