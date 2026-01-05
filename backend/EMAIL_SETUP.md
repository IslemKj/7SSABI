# Configuration Email (Zoho Mail)

## Configuration

Pour activer l'envoi d'emails depuis le formulaire de contact, vous devez configurer les paramètres SMTP de Zoho Mail dans le fichier `.env`.

### 1. Obtenir les identifiants Zoho Mail

#### Option 1: Utiliser le mot de passe du compte
- Utilisez directement votre email et mot de passe Zoho Mail

#### Option 2: Utiliser un mot de passe spécifique à l'application (Recommandé)
1. Connectez-vous à votre compte Zoho Mail
2. Accédez à **Paramètres** > **Sécurité** > **Mots de passe d'application**
3. Générez un nouveau mot de passe d'application pour "Involeo"
4. Copiez le mot de passe généré

### 2. Configurer le fichier .env

Ouvrez le fichier `backend/.env` et configurez les variables suivantes :

```env
# Email Configuration (Zoho Mail)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USERNAME=votre-email@votredomaine.com
SMTP_PASSWORD=votre-mot-de-passe-ou-mot-de-passe-application
SMTP_FROM_EMAIL=votre-email@votredomaine.com
CONTACT_EMAIL=contact@involeo.com
```

**Description des variables :**
- `SMTP_HOST`: Serveur SMTP de Zoho (smtp.zoho.com)
- `SMTP_PORT`: Port SMTP (587 pour TLS)
- `SMTP_USERNAME`: Votre adresse email Zoho complète
- `SMTP_PASSWORD`: Votre mot de passe Zoho ou mot de passe d'application
- `SMTP_FROM_EMAIL`: L'adresse email qui apparaîtra comme expéditeur (généralement la même que SMTP_USERNAME)
- `CONTACT_EMAIL`: L'adresse email où les messages du formulaire de contact seront envoyés

### 3. Redémarrer l'application

Après avoir modifié le fichier `.env`, redémarrez le serveur backend :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
cd backend
python run.py
```

## Test

1. Accédez à la page **Aide** dans l'application
2. Remplissez le formulaire de contact dans la section "Envoyez-nous un message"
3. Cliquez sur "Envoyer le message"
4. Vérifiez que l'email arrive à l'adresse configurée dans `CONTACT_EMAIL`

## Format de l'email

Les emails envoyés depuis le formulaire de contact contiennent :
- **Sujet**: [Involeo Contact] + Sujet saisi
- **Corps**: Email formaté en HTML avec :
  - Nom de l'expéditeur
  - Email de l'expéditeur
  - Sujet du message
  - Contenu du message

## Dépannage

### L'email ne s'envoie pas

1. **Vérifier les logs du serveur** : Regardez les messages d'erreur dans la console
2. **Vérifier les identifiants** : Assurez-vous que l'email et le mot de passe sont corrects
3. **Vérifier la connexion SMTP** : 
   - Port 587 doit être ouvert sur votre réseau
   - TLS/STARTTLS doit être autorisé
4. **Authentification à deux facteurs** : Si activée sur votre compte Zoho, vous DEVEZ utiliser un mot de passe d'application

### Erreur "Authentication failed"

- Vérifiez que vous utilisez l'adresse email complète pour `SMTP_USERNAME`
- Si vous avez l'authentification à deux facteurs, créez un mot de passe d'application
- Assurez-vous qu'il n'y a pas d'espaces avant/après dans les variables

### Emails marqués comme spam

- Configurez les enregistrements SPF et DKIM pour votre domaine dans Zoho Mail
- Utilisez une adresse email professionnelle (pas @gmail.com ou @yahoo.com)

## Autres fournisseurs SMTP

Si vous n'utilisez pas Zoho Mail, vous pouvez utiliser d'autres fournisseurs :

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=votre-email@gmail.com
SMTP_PASSWORD=mot-de-passe-application
```
Note: Vous devez créer un mot de passe d'application dans les paramètres de sécurité Google

### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=votre-email@outlook.com
SMTP_PASSWORD=votre-mot-de-passe
```

### SendGrid, Mailgun, etc.
Consultez la documentation de votre fournisseur pour les paramètres SMTP.
