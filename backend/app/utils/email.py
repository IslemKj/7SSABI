"""
Email utility for sending emails via Zoho Mail SMTP
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging
from ..config import settings

logger = logging.getLogger(__name__)


def send_email(
    to_email: str,
    subject: str,
    body_html: str,
    body_text: Optional[str] = None,
) -> bool:
    """
    Send an email via Zoho Mail SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body_html: HTML body content
        body_text: Plain text body content (optional)
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add plain text version if provided
        if body_text:
            part1 = MIMEText(body_text, 'plain')
            msg.attach(part1)
        
        # Add HTML version
        part2 = MIMEText(body_html, 'html')
        msg.attach(part2)
        
        # Connect to Zoho SMTP server with timeout
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


def send_contact_form_email(
    name: str,
    email: str,
    subject: str,
    message: str,
) -> bool:
    """
    Send contact form submission to support email
    
    Args:
        name: Sender's name
        email: Sender's email
        subject: Message subject
        message: Message content
    
    Returns:
        bool: True if email was sent successfully
    """
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background: #f9f9f9;
                padding: 20px;
                border: 1px solid #e0e0e0;
            }}
            .field {{
                margin-bottom: 15px;
            }}
            .field-label {{
                font-weight: bold;
                color: #667eea;
            }}
            .footer {{
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Nouveau message depuis le formulaire de contact</h2>
            </div>
            <div class="content">
                <div class="field">
                    <div class="field-label">Nom:</div>
                    <div>{name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div><a href="mailto:{email}">{email}</a></div>
                </div>
                <div class="field">
                    <div class="field-label">Sujet:</div>
                    <div>{subject}</div>
                </div>
                <div class="field">
                    <div class="field-label">Message:</div>
                    <div style="white-space: pre-wrap;">{message}</div>
                </div>
            </div>
            <div class="footer">
                <p>Ce message a été envoyé depuis le formulaire de contact Involeo.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
Nouveau message depuis le formulaire de contact

Nom: {name}
Email: {email}
Sujet: {subject}

Message:
{message}

---
Ce message a été envoyé depuis le formulaire de contact Involeo.
    """
    
    email_subject = f"[Involeo Contact] {subject}"
    
    return send_email(
        to_email=settings.CONTACT_EMAIL,
        subject=email_subject,
        body_html=html_body,
        body_text=text_body,
    )


def send_password_reset_email(
    email: str,
    reset_token: str,
    user_name: str,
) -> bool:
    """
    Send password reset email with reset link
    
    Args:
        email: User's email address
        reset_token: Password reset token
        user_name: User's name
    
    Returns:
        bool: True if email was sent successfully
    """
    # Construct reset link (frontend URL)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
            }}
            .content {{
                background: #f9f9f9;
                padding: 30px 20px;
                border: 1px solid #e0e0e0;
                border-top: none;
            }}
            .button {{
                display: inline-block;
                padding: 14px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }}
            .warning {{
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                border-radius: 6px;
                margin: 15px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
                <p>Bonjour {user_name},</p>
                
                <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Involeo.</p>
                
                <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
                
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                
                <div class="warning">
                    <strong>⏱️ Ce lien est valide pendant 1 heure.</strong>
                </div>
                
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
                
                <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #667eea;">{reset_link}</p>
            </div>
            <div class="footer">
                <p>Cet email a été envoyé automatiquement par Involeo.</p>
                <p>Pour des raisons de sécurité, ne partagez jamais ce lien avec personne.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
Bonjour {user_name},

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Involeo.

Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :
{reset_link}

⏱️ Ce lien est valide pendant 1 heure.

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.

---
Cet email a été envoyé automatiquement par Involeo.
Pour des raisons de sécurité, ne partagez jamais ce lien avec personne.
    """
    
    return send_email(
        to_email=email,
        subject="Réinitialisation de votre mot de passe Involeo",
        body_html=html_body,
        body_text=text_body,
    )
