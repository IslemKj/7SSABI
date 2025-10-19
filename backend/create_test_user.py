"""
Script simple pour créer un utilisateur de test
"""
from app.database import SessionLocal, create_tables
from app.models import User
from app.utils.auth import get_password_hash

def create_test_user():
    # Créer les tables
    create_tables()
    
    db = SessionLocal()
    
    try:
        # Vérifier si l'utilisateur existe déjà
        existing = db.query(User).filter(User.email == "admin@test.com").first()
        if existing:
            print("✅ L'utilisateur admin@test.com existe déjà")
            print(f"   Mot de passe: admin123")
            return
        
        # Créer l'utilisateur
        user = User(
            name="Admin Test",
            email="admin@test.com",
            password_hash=get_password_hash("admin123"),
            entreprise_name="Test Company",
            nif="000000000000000",
            phone="0555000000",
            address="Test Address, Alger"
        )
        db.add(user)
        db.commit()
        print("✅ Utilisateur créé avec succès!")
        print(f"   Email: admin@test.com")
        print(f"   Mot de passe: admin123")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
