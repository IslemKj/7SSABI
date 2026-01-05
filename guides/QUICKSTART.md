# Guide de Démarrage Rapide - 7SSABI

## 🚀 Installation en 3 étapes

### Étape 1: Installation
```powershell
cd backend
.\install.ps1
```

### Étape 2: Configuration
Éditez le fichier `backend\.env`:
```env
SECRET_KEY=votre-cle-secrete-ici
DATABASE_URL=sqlite:///./7ssabi.db
```

### Étape 3: Démarrage
```powershell
.\start.ps1
```

## 📚 Accès

- **API**: http://localhost:8000
- **Documentation interactive**: http://localhost:8000/docs
- **Documentation alternative**: http://localhost:8000/redoc

## 🎯 Premier test

### 1. Créer un compte
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "Test123456",
  "entreprise_name": "Benali Services",
  "nif": "123456789",
  "phone": "0555123456"
}
```

### 2. Se connecter
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "Test123456"
}
```

Vous recevrez un token JWT à utiliser pour les autres requêtes.

### 3. Tester l'API
Utilisez le token reçu:
```http
GET http://localhost:8000/api/clients
Authorization: Bearer VOTRE_TOKEN_ICI
```

## 📖 Documentation complète

Voir le fichier `README.md` pour la documentation complète.

## 🆘 Problèmes courants

### Python non trouvé
Installez Python 3.9+ depuis https://www.python.org/

### Erreur de dépendances
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### Port 8000 déjà utilisé
Modifiez le port dans `backend\run.py`:
```python
uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
```

## 📞 Support

Pour toute question, consultez le README principal ou ouvrez une issue.
