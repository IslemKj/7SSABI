"""
Script pour générer des données de test
"""
from datetime import date, timedelta
from decimal import Decimal
from app.database import SessionLocal, create_tables
from app.models import User, Client, Product, Invoice, InvoiceItem, Expense
from app.utils.auth import get_password_hash


def create_sample_data():
    """Créer des données d'exemple pour tester l'application"""
    
    db = SessionLocal()
    
    try:
        # Créer les tables
        create_tables()
        
        # Vérifier si des données existent déjà
        existing_user = db.query(User).first()
        if existing_user:
            print("❌ Des données existent déjà dans la base de données")
            return
        
        print("📝 Création des données de test...")
        
        # Créer un utilisateur
        user = User(
            name="Ahmed Benali",
            email="ahmed@example.com",
            password_hash=get_password_hash("Test123456"),
            entreprise_name="Benali Services SARL",
            nif="123456789012345",
            phone="0555123456",
            address="Rue de la Liberté, Alger, Algérie"
        )
        db.add(user)
        db.flush()
        print(f"✅ Utilisateur créé: {user.email}")
        
        # Créer des clients
        clients_data = [
            {
                "name": "Mohammed Karim",
                "company_name": "Karim Import-Export",
                "phone": "0661234567",
                "email": "karim@example.com",
                "address": "Zone Industrielle, Oran",
                "nif": "987654321098765"
            },
            {
                "name": "Fatima Mansouri",
                "company_name": "Mansouri Distribution",
                "phone": "0771234567",
                "email": "mansouri@example.com",
                "address": "Centre Ville, Constantine",
                "nif": "456789012345678"
            },
            {
                "name": "Youcef Brahim",
                "company_name": "Brahim & Fils",
                "phone": "0551234567",
                "email": "brahim@example.com",
                "address": "Bab Ezzouar, Alger",
                "nif": "234567890123456"
            }
        ]
        
        clients = []
        for client_data in clients_data:
            client = Client(**client_data, user_id=user.id)
            db.add(client)
            clients.append(client)
        db.flush()
        print(f"✅ {len(clients)} clients créés")
        
        # Créer des produits/services
        products_data = [
            {
                "name": "Consultation Web",
                "description": "Service de consultation en développement web",
                "unit_price": Decimal("8000.00"),
                "category": "Services",
                "is_service": True
            },
            {
                "name": "Développement Site Web",
                "description": "Création de site web professionnel",
                "unit_price": Decimal("50000.00"),
                "category": "Services",
                "is_service": True
            },
            {
                "name": "Maintenance Mensuelle",
                "description": "Service de maintenance et mise à jour",
                "unit_price": Decimal("5000.00"),
                "category": "Services",
                "is_service": True
            },
            {
                "name": "Formation Informatique",
                "description": "Formation en bureautique et outils informatiques",
                "unit_price": Decimal("3000.00"),
                "category": "Formation",
                "is_service": True
            },
            {
                "name": "Pack Office 365",
                "description": "Licence Office 365 Business",
                "unit_price": Decimal("12000.00"),
                "category": "Logiciels",
                "stock": 10,
                "is_service": False
            }
        ]
        
        products = []
        for product_data in products_data:
            product = Product(**product_data, user_id=user.id)
            db.add(product)
            products.append(product)
        db.flush()
        print(f"✅ {len(products)} produits/services créés")
        
        # Créer des factures
        today = date.today()
        
        # Facture 1 - Payée
        invoice1 = Invoice(
            user_id=user.id,
            client_id=clients[0].id,
            invoice_number="FA-2025-00001",
            date=today - timedelta(days=30),
            due_date=today - timedelta(days=10),
            total_ht=Decimal("58000.00"),
            tva_rate=Decimal("19.00"),
            tva_amount=Decimal("11020.00"),
            total_ttc=Decimal("69020.00"),
            status="paid",
            paid_amount=Decimal("69020.00"),
            notes="Merci pour votre confiance!",
            is_quote=False
        )
        db.add(invoice1)
        db.flush()
        
        # Items facture 1
        db.add(InvoiceItem(
            invoice_id=invoice1.id,
            product_id=products[0].id,
            description=products[0].name,
            quantity=2,
            unit_price=products[0].unit_price,
            total=products[0].unit_price * 2
        ))
        db.add(InvoiceItem(
            invoice_id=invoice1.id,
            product_id=products[1].id,
            description=products[1].name,
            quantity=1,
            unit_price=products[1].unit_price,
            total=products[1].unit_price
        ))
        
        # Facture 2 - Impayée
        invoice2 = Invoice(
            user_id=user.id,
            client_id=clients[1].id,
            invoice_number="FA-2025-00002",
            date=today - timedelta(days=15),
            due_date=today + timedelta(days=15),
            total_ht=Decimal("15000.00"),
            tva_rate=Decimal("19.00"),
            tva_amount=Decimal("2850.00"),
            total_ttc=Decimal("17850.00"),
            status="unpaid",
            paid_amount=Decimal("0.00"),
            is_quote=False
        )
        db.add(invoice2)
        db.flush()
        
        db.add(InvoiceItem(
            invoice_id=invoice2.id,
            product_id=products[2].id,
            description=products[2].name,
            quantity=3,
            unit_price=products[2].unit_price,
            total=products[2].unit_price * 3
        ))
        
        # Devis 1
        quote1 = Invoice(
            user_id=user.id,
            client_id=clients[2].id,
            invoice_number="DEV-2025-00001",
            date=today,
            due_date=today + timedelta(days=30),
            total_ht=Decimal("50000.00"),
            tva_rate=Decimal("19.00"),
            tva_amount=Decimal("9500.00"),
            total_ttc=Decimal("59500.00"),
            status="unpaid",
            paid_amount=Decimal("0.00"),
            is_quote=True
        )
        db.add(quote1)
        db.flush()
        
        db.add(InvoiceItem(
            invoice_id=quote1.id,
            product_id=products[1].id,
            description=products[1].name,
            quantity=1,
            unit_price=products[1].unit_price,
            total=products[1].unit_price
        ))
        
        print("✅ 3 factures/devis créés")
        
        # Créer des dépenses
        expenses_data = [
            {
                "category": "Internet",
                "amount": Decimal("3000.00"),
                "date": today - timedelta(days=25),
                "description": "Abonnement internet Algérie Télécom"
            },
            {
                "category": "Électricité",
                "amount": Decimal("5000.00"),
                "date": today - timedelta(days=20),
                "description": "Facture SONELGAZ"
            },
            {
                "category": "Transport",
                "amount": Decimal("2000.00"),
                "date": today - timedelta(days=15),
                "description": "Carburant et frais de déplacement"
            },
            {
                "category": "Fournitures",
                "amount": Decimal("1500.00"),
                "date": today - timedelta(days=10),
                "description": "Papeterie et fournitures de bureau"
            },
            {
                "category": "Logiciels",
                "amount": Decimal("8000.00"),
                "date": today - timedelta(days=5),
                "description": "Abonnement serveur et outils SaaS"
            }
        ]
        
        for expense_data in expenses_data:
            expense = Expense(**expense_data, user_id=user.id)
            db.add(expense)
        
        print(f"✅ {len(expenses_data)} dépenses créées")
        
        # Commit toutes les modifications
        db.commit()
        
        print("\n" + "="*50)
        print("✅ Données de test créées avec succès!")
        print("="*50)
        print("\n📧 Compte de test:")
        print(f"   Email: {user.email}")
        print(f"   Mot de passe: Test123456")
        print("\n🌐 Accédez à l'API:")
        print("   http://localhost:8000/docs")
        print("\n")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Erreur lors de la création des données: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()
