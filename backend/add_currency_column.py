"""
Script pour ajouter les colonnes 'currency' aux tables products et invoices
"""
import sqlite3
import os

# Chemin vers la base de données
db_path = os.path.join(os.path.dirname(__file__), "7ssabi.db")

def add_currency_columns():
    """Ajoute les colonnes currency aux tables products et invoices"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Vérifier si la colonne currency existe déjà dans products
        cursor.execute("PRAGMA table_info(products)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'currency' not in columns:
            print("➕ Ajout de la colonne 'currency' à la table 'products'...")
            cursor.execute("ALTER TABLE products ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR' NOT NULL")
            print("✅ Colonne 'currency' ajoutée à 'products'")
        else:
            print("ℹ️  La colonne 'currency' existe déjà dans 'products'")
        
        # Vérifier si la colonne currency existe déjà dans invoices
        cursor.execute("PRAGMA table_info(invoices)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'currency' not in columns:
            print("➕ Ajout de la colonne 'currency' à la table 'invoices'...")
            cursor.execute("ALTER TABLE invoices ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR' NOT NULL")
            print("✅ Colonne 'currency' ajoutée à 'invoices'")
        else:
            print("ℹ️  La colonne 'currency' existe déjà dans 'invoices'")
        
        conn.commit()
        print("\n✅ Migration terminée avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur lors de la migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Migration: Ajout des colonnes currency")
    print("=" * 50)
    add_currency_columns()
