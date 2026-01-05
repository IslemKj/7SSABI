"""
Script to make a user admin by email
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def make_admin(email: str):
    """Make a user admin by email"""
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, name, email, role FROM users WHERE email = :email"),
            {"email": email}
        )
        user = result.fetchone()
        
        if not user:
            print(f"❌ User with email {email} not found")
            return
        
        if user[3] == 'admin':
            print(f"⚠️  User {user[1]} ({email}) is already an admin")
            return
        
        conn.execute(
            text("UPDATE users SET role = 'admin' WHERE email = :email"),
            {"email": email}
        )
        conn.commit()
        print(f"✅ User {user[1]} ({email}) is now an admin!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <email>")
        print("Example: python make_admin.py user@example.com")
        sys.exit(1)
    
    make_admin(sys.argv[1])
