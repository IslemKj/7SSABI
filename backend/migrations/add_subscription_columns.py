"""
Add subscription fields to users table
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine


def add_subscription_columns():
    """Add subscription-related columns to users table"""
    
    with engine.connect() as connection:
        # Check if columns already exist
        result = connection.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('subscription_plan', 'subscription_status', 'subscription_started_at');
        """))
        
        existing_columns = [row[0] for row in result]
        
        if 'subscription_plan' in existing_columns:
            print("✓ Columns already exist, skipping...")
            return
        
        print("Adding subscription columns to users table...")
        
        # Add subscription_plan column
        connection.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free';
        """))
        connection.commit()
        print("✓ Added subscription_plan column")
        
        # Add subscription_status column
        connection.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active';
        """))
        connection.commit()
        print("✓ Added subscription_status column")
        
        # Add subscription_started_at column
        connection.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP;
        """))
        connection.commit()
        print("✓ Added subscription_started_at column")
        
        print("\n✅ Migration completed successfully!")
        print("   All users are now on 'free' plan by default")


if __name__ == "__main__":
    try:
        add_subscription_columns()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)
