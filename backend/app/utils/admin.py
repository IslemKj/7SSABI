"""
Admin middleware and utilities
"""
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from ..models import User
from ..database import get_db
from .auth import get_current_user


def get_current_admin_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """
    Vérifie que l'utilisateur actuel est un administrateur
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user
