"""
Upgrade User Script - Manual Payment Processing
Usage: python upgrade_user.py <email> <premium>
Plans: premium (5,000 DA/month)
"""
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.models import User


def upgrade_user(email: str, plan: str):
    """
    Upgrade a user to a paid plan manually
    """
    # Validate plan
    valid_plans = ['premium']
    if plan not in valid_plans:
        print(f"❌ Invalid plan. Must be: premium")
        return False
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Find user
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ User not found: {email}")
            return False
        
        # Current plan
        old_plan = getattr(user, 'subscription_plan', 'free')
        
        # Upgrade user
        # Note: Add subscription_plan and subscription_status columns to User model
        if not hasattr(user, 'subscription_plan'):
            print("⚠️  Warning: User model doesn't have subscription_plan column")
            print("   Add these columns to the User model:")
            print("   subscription_plan = Column(String(50), default='free')")
            print("   subscription_status = Column(String(20), default='active')")
            print("   subscription_started_at = Column(DateTime, nullable=True)")
            return False
        
        user.subscription_plan = plan
        user.subscription_status = 'active'
        user.subscription_started_at = datetime.utcnow()
        
        db.commit()
        
        print(f"✅ User upgraded successfully!")
        print(f"   Email: {email}")
        print(f"   Old Plan: {old_plan}")
        print(f"   New Plan: {plan}")
        print(f"   Status: active")
        print(f"   Started: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error upgrading user: {e}")
        db.rollback()
        return False
        
    finally:
        db.close()


def list_user_info(email: str):
    """
    Display current user information
    """
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ User not found: {email}")
            return False
        
        print(f"\n📊 User Information:")
        print(f"   Name: {user.name}")
        print(f"   Email: {user.email}")
        print(f"   Company: {user.entreprise_name}")
        print(f"   Role: {user.role}")
        print(f"   Active: {user.is_active}")
        
        if hasattr(user, 'subscription_plan'):
            print(f"   Plan: {user.subscription_plan}")
            print(f"   Status: {user.subscription_status}")
            if user.subscription_started_at:
                print(f"   Started: {user.subscription_started_at.strftime('%Y-%m-%d')}")
        else:
            print(f"   Plan: free (default)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
        
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Upgrade user:     python upgrade_user.py <email> premium")
        print("  View user info:   python upgrade_user.py <email>")
        print("\nPlan: premium (5,000 DA/month)")
        print("\nExamples:")
        print("  python upgrade_user.py user@example.com premium")
        print("  python upgrade_user.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    
    if len(sys.argv) == 2:
        # Just show user info
        list_user_info(email)
    else:
        # Upgrade user
        plan = sys.argv[2]
        upgrade_user(email, plan)
