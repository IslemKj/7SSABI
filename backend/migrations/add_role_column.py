"""
Migration: Add role column to users table
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def upgrade():
    """Add role column to users table"""
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='role'
        """))
        
        if not result.fetchone():
            print("Adding 'role' column to users table...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN role VARCHAR(20) DEFAULT 'user'
            """))
            conn.commit()
            print("✅ Role column added successfully")
        else:
            print("⚠️  Role column already exists")

if __name__ == "__main__":
    upgrade()
