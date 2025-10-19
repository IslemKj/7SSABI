"""
Tests pour l'authentification
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# Base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override de la dépendance de base de données pour les tests"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    """Créer la base de données de test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_user(setup_database):
    """Test de création d'un utilisateur"""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "Test123456",
            "entreprise_name": "Test Company",
            "nif": "123456789012345",
            "phone": "0555123456"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data


def test_register_duplicate_email(setup_database):
    """Test de création d'un utilisateur avec email existant"""
    # Premier utilisateur
    client.post(
        "/api/auth/register",
        json={
            "name": "User 1",
            "email": "duplicate@example.com",
            "password": "Test123456"
        }
    )
    
    # Deuxième utilisateur avec le même email
    response = client.post(
        "/api/auth/register",
        json={
            "name": "User 2",
            "email": "duplicate@example.com",
            "password": "Test123456"
        }
    )
    
    assert response.status_code == 400
    assert "existe déjà" in response.json()["detail"]


def test_login_success(setup_database):
    """Test de connexion réussie"""
    # Créer un utilisateur
    client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "Test123456"
        }
    )
    
    # Se connecter
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "Test123456"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(setup_database):
    """Test de connexion avec mauvais mot de passe"""
    # Créer un utilisateur
    client.post(
        "/api/auth/register",
        json={
            "name": "Wrong Pass User",
            "email": "wrongpass@example.com",
            "password": "Test123456"
        }
    )
    
    # Tenter de se connecter avec mauvais mot de passe
    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrongpass@example.com",
            "password": "WrongPassword"
        }
    )
    
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_login_nonexistent_user(setup_database):
    """Test de connexion avec utilisateur inexistant"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "Test123456"
        }
    )
    
    assert response.status_code == 401


def test_access_protected_route_without_token():
    """Test d'accès à une route protégée sans token"""
    response = client.get("/api/clients")
    assert response.status_code == 401


def test_access_protected_route_with_token(setup_database):
    """Test d'accès à une route protégée avec token"""
    # Créer et connecter un utilisateur
    client.post(
        "/api/auth/register",
        json={
            "name": "Protected User",
            "email": "protected@example.com",
            "password": "Test123456"
        }
    )
    
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "protected@example.com",
            "password": "Test123456"
        }
    )
    
    token = login_response.json()["access_token"]
    
    # Accéder à une route protégée
    response = client.get(
        "/api/clients",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
