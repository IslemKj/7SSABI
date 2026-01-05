"""
Routes pour le formulaire de contact
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from ..utils.email import send_contact_form_email, send_email
from ..config import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["Contact"])


class ContactFormRequest(BaseModel):
    """Schéma pour le formulaire de contact"""
    name: str
    email: EmailStr
    subject: str
    message: str


class DemoRequest(BaseModel):
    """Schéma pour demande de démo/inscription"""
    email: EmailStr
    name: str = ""


@router.post("/demo", status_code=status.HTTP_200_OK)
def request_demo(data: DemoRequest):
    """
    Handle demo/signup request from landing page
    Send email synchronously to debug
    """
    try:
        logger.info(f"📥 Demo request received from {data.email}")
        
        # Send email synchronously for debugging
        success = send_demo_notification(data.email, data.name)
        
        logger.info(f"Email send result: {success}")
        
        return {
            "success": True,
            "message": "Merci! Nous vous contacterons très bientôt pour finaliser votre inscription.",
        }
    except Exception as e:
        logger.error(f"❌ Error in demo endpoint: {e}", exc_info=True)
        return {
            "success": True,
            "message": "Merci! Nous vous contacterons très bientôt.",
        }


def send_demo_notification(contact_email: str, name: str = ""):
    """
    Send email notification to admin when someone requests demo/signup
    """
    logger.info(f"🔔 Starting email send for demo request from {contact_email}")
    logger.info(f"📧 Sending to: {settings.CONTACT_EMAIL}")
    logger.info(f"📤 SMTP Config: {settings.SMTP_HOST}:{settings.SMTP_PORT}, User: {settings.SMTP_USERNAME}")
    
    name_text = f"Nom: {name}\n" if name else ""
    text_content = f"""
Nouvelle demande d'inscription Involeo

{name_text}Email: {contact_email}
Date: {datetime.now().strftime('%d/%m/%Y à %H:%M')}

Cette personne souhaite s'inscrire à Involeo (5,000 DA/mois).

ACTION REQUISE:
1. Contactez-la pour lui envoyer les instructions de paiement (CCP/Virement/Espèces)
2. Après réception du paiement, activez son compte

---
Involeo - Notification automatique
    """
    
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
        .info-box {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }}
        .action-box {{ background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        .label {{ font-weight: bold; color: #667eea; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Nouvelle Demande d'Inscription</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez reçu une nouvelle demande d'inscription via le site Involeo.</p>
            
            <div class="info-box">
                {'<p><span class="label">Nom:</span> ' + name + '</p>' if name else ''}
                <p><span class="label">Email:</span> <strong>{contact_email}</strong></p>
                <p><span class="label">Date:</span> {datetime.now().strftime('%d/%m/%Y à %H:%M')}</p>
                <p><span class="label">Plan:</span> Premium (5,000 DA/mois)</p>
            </div>
            
            <div class="action-box">
                <p><strong>⚡ ACTION REQUISE:</strong></p>
                <ol>
                    <li>Contactez <strong>{contact_email}</strong> pour envoyer les instructions de paiement</li>
                    <li>Options: CCP (BaridiMob), virement bancaire, ou espèces</li>
                    <li>Après réception du paiement, activez le compte avec:
                        <br><code>python scripts/upgrade_user.py {contact_email} premium</code>
                    </li>
                </ol>
            </div>
            
            <div class="footer">
                <p>Involeo - Système de notification automatique</p>
            </div>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        success = send_email(
            to_email=settings.CONTACT_EMAIL,
            subject="🚀 Nouvelle demande d'inscription - Involeo",
            body_html=html_content,
            body_text=text_content
        )
        
        if success:
            logger.info(f"✅ Demo request notification sent successfully for {contact_email}")
        else:
            logger.error(f"❌ Failed to send demo notification for {contact_email}")
        return success
    except Exception as e:
        logger.error(f"❌ Exception sending demo notification: {e}", exc_info=True)
        return False


@router.post("/send")
async def send_contact_message(data: ContactFormRequest):
    """
    Envoyer un message depuis le formulaire de contact
    
    Args:
        data: Données du formulaire de contact
    
    Returns:
        dict: Message de confirmation
    
    Raises:
        HTTPException: Si l'envoi de l'email échoue
    """
    try:
        # Validate input
        if not data.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le nom est requis"
            )
        
        if not data.subject.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le sujet est requis"
            )
        
        if not data.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le message est requis"
            )
        
        # Send email
        success = send_contact_form_email(
            name=data.name.strip(),
            email=data.email,
            subject=data.subject.strip(),
            message=data.message.strip(),
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'envoi du message. Veuillez réessayer plus tard."
            )
        
        logger.info(f"Contact form submitted by {data.name} ({data.email})")
        
        return {
            "success": True,
            "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur s'est produite lors de l'envoi du message"
        )
