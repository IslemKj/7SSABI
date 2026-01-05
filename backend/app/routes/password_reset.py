"""
Routes pour la réinitialisation de mot de passe
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import secrets
import logging

from ..database import get_db
from ..models import User, PasswordResetToken
from ..schemas.schemas import PasswordResetRequest, PasswordResetConfirm
from ..utils.email import send_password_reset_email
from ..utils.auth import get_password_hash

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/password-reset", tags=["Password Reset"])


@router.post("/request")
async def request_password_reset(
    data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Demander une réinitialisation de mot de passe
    Envoie un email avec un lien de réinitialisation
    
    Args:
        data: Email de l'utilisateur
        db: Session de base de données
    
    Returns:
        dict: Message de confirmation
    """
    # Trouver l'utilisateur par email
    user = db.query(User).filter(User.email == data.email).first()
    
    # Pour des raisons de sécurité, toujours retourner le même message
    # même si l'utilisateur n'existe pas
    if not user:
        logger.warning(f"Password reset requested for non-existent email: {data.email}")
        return {
            "success": True,
            "message": "Si cet email existe dans notre système, vous recevrez un lien de réinitialisation."
        }
    
    # Générer un token unique
    token = secrets.token_urlsafe(32)
    
    # Créer l'expiration (1 heure)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Invalider tous les anciens tokens de cet utilisateur
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.is_used == False
    ).update({"is_used": True})
    
    # Créer un nouveau token
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(reset_token)
    db.commit()
    
    # Envoyer l'email de réinitialisation
    try:
        email_sent = send_password_reset_email(
            email=user.email,
            reset_token=token,
            user_name=user.name
        )
        
        if not email_sent:
            logger.error(f"Failed to send password reset email to {user.email}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard."
            )
    except Exception as e:
        logger.error(f"Error sending password reset email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard."
        )
    
    logger.info(f"Password reset email sent to {user.email}")
    
    return {
        "success": True,
        "message": "Si cet email existe dans notre système, vous recevrez un lien de réinitialisation."
    }


@router.post("/verify-token")
async def verify_reset_token(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Vérifier la validité d'un token de réinitialisation
    
    Args:
        token: Token de réinitialisation
        db: Session de base de données
    
    Returns:
        dict: Statut de validité du token
    """
    # Trouver le token
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token
    ).first()
    
    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide"
        )
    
    # Vérifier si le token est expiré
    if datetime.now(timezone.utc) > reset_token.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce lien a expiré. Veuillez demander un nouveau lien de réinitialisation."
        )
    
    # Vérifier si le token a déjà été utilisé
    if reset_token.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce lien a déjà été utilisé. Veuillez demander un nouveau lien de réinitialisation."
        )
    
    return {
        "valid": True,
        "message": "Token valide"
    }


@router.post("/confirm")
async def confirm_password_reset(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Confirmer la réinitialisation de mot de passe
    
    Args:
        data: Token et nouveau mot de passe
        db: Session de base de données
    
    Returns:
        dict: Message de confirmation
    """
    # Trouver le token
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == data.token
    ).first()
    
    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide"
        )
    
    # Vérifier si le token est expiré
    if datetime.now(timezone.utc) > reset_token.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce lien a expiré. Veuillez demander un nouveau lien de réinitialisation."
        )
    
    # Vérifier si le token a déjà été utilisé
    if reset_token.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce lien a déjà été utilisé. Veuillez demander un nouveau lien de réinitialisation."
        )
    
    # Trouver l'utilisateur
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Mettre à jour le mot de passe
    user.password_hash = get_password_hash(data.new_password)
    
    # Marquer le token comme utilisé
    reset_token.is_used = True
    
    db.commit()
    
    logger.info(f"Password reset successful for user {user.email}")
    
    return {
        "success": True,
        "message": "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter."
    }
