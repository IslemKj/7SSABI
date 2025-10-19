"""
Application principale FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .database import create_tables
from .routes import auth, clients, products, invoices, expenses, dashboard

# Créer l'application FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API de gestion et comptabilité pour micro-entreprises algériennes",
    debug=settings.DEBUG
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer les dossiers nécessaires
os.makedirs("invoices", exist_ok=True)
os.makedirs("receipts", exist_ok=True)

# Monter les fichiers statiques
if os.path.exists("invoices"):
    app.mount("/invoices", StaticFiles(directory="invoices"), name="invoices")

# Inclure les routes
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(products.router)
app.include_router(invoices.router)
app.include_router(expenses.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def startup_event():
    """Événement au démarrage de l'application"""
    create_tables()
    print(f"✅ {settings.APP_NAME} v{settings.APP_VERSION} démarré")
    print(f"📚 Documentation: http://localhost:8000/docs")


@app.get("/")
def root():
    """Point d'entrée de l'API"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "Bienvenue sur 7SSABI - API de gestion comptabilité",
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    """Vérification de l'état de l'API"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
