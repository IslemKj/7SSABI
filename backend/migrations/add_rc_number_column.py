"""
Migration: Add rc_number column to users and clients tables
Date: 2026-01-03
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.config import settings

def migrate():
    """Add rc_number column to users and clients tables"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        # Start a transaction
        trans = connection.begin()
        
        try:
            # Add rc_number to users table
            print("Adding rc_number column to users table...")
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS rc_number VARCHAR(50);
            """))
            
            # Add rc_number to clients table
            print("Adding rc_number column to clients table...")
            connection.execute(text("""
                ALTER TABLE clients 
                ADD COLUMN IF NOT EXISTS rc_number VARCHAR(50);
            """))
            
            # Commit the transaction
            trans.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            # Rollback on error
            trans.rollback()
            print(f"Migration failed: {e}")
            raise

if __name__ == "__main__":
    migrate()
