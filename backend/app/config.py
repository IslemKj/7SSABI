"""
Configuration de l'application
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configuration de l'application"""
    
    # Application
    APP_NAME: str = "Involeo - Gestion Comptabilité"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Base de données
    DATABASE_URL: str = "sqlite:///./involeo.db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Frontend URL (for password reset links)
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Email (Zoho Mail)
    SMTP_HOST: str = "smtp.zoho.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""  # Your Zoho email
    SMTP_PASSWORD: str = ""  # Your Zoho password or app-specific password
    SMTP_FROM_EMAIL: str = ""  # Sender email (usually same as SMTP_USERNAME)
    CONTACT_EMAIL: str = "contact@involeo.com"  # Where contact form emails will be sent
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
