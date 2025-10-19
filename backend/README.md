# 7SSABI Backend - API FastAPI

## Installation rapide

1. Créer un environnement virtuel:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Installer les dépendances:
```powershell
pip install -r requirements.txt
```

3. Configuration:
```powershell
copy .env.example .env
# Éditer .env avec vos paramètres
```

4. Lancer le serveur:
```powershell
python run.py
```

## Accès à la documentation

- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## Structure du projet

```
backend/
├── app/
│   ├── models/          # Modèles SQLAlchemy
│   ├── routes/          # Routes API
│   ├── schemas/         # Schémas Pydantic
│   ├── services/        # Logique métier
│   ├── utils/           # Utilitaires (auth, PDF, etc.)
│   ├── config.py        # Configuration
│   ├── database.py      # Configuration DB
│   └── main.py          # Application principale
├── invoices/            # Factures PDF générées
├── requirements.txt     # Dépendances Python
├── .env                 # Variables d'environnement
└── run.py              # Script de démarrage
```

## Commandes utiles

### Développement
```powershell
# Lancer avec rechargement automatique
uvicorn app.main:app --reload

# Lancer sur un port spécifique
uvicorn app.main:app --port 8080

# Lancer avec logs détaillés
uvicorn app.main:app --reload --log-level debug
```

### Base de données

Pour PostgreSQL, créer la base:
```sql
CREATE DATABASE 7ssabi_db;
CREATE USER ssabi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE 7ssabi_db TO ssabi_user;
```

Puis mettre à jour `.env`:
```
DATABASE_URL=postgresql://ssabi_user:your_password@localhost:5432/7ssabi_db
```

### Tests

```powershell
# Installer pytest
pip install pytest pytest-asyncio httpx

# Lancer les tests
pytest
```

## Variables d'environnement

Voir `.env.example` pour toutes les variables disponibles.

### Principales variables:

- `DATABASE_URL`: URL de connexion à la base de données
- `SECRET_KEY`: Clé secrète pour JWT (générer avec `openssl rand -hex 32`)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Durée de validité des tokens (défaut: 30)
- `CORS_ORIGINS`: Origines autorisées pour CORS

## Endpoints principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Clients
- `GET /api/clients` - Lister
- `POST /api/clients` - Créer
- `GET /api/clients/{id}` - Détails
- `PUT /api/clients/{id}` - Modifier
- `DELETE /api/clients/{id}` - Supprimer

### Produits
- `GET /api/products` - Lister
- `POST /api/products` - Créer
- `GET /api/products/{id}` - Détails
- `PUT /api/products/{id}` - Modifier
- `DELETE /api/products/{id}` - Supprimer

### Factures
- `GET /api/invoices` - Lister
- `POST /api/invoices` - Créer
- `GET /api/invoices/{id}` - Détails
- `PUT /api/invoices/{id}` - Modifier
- `DELETE /api/invoices/{id}` - Supprimer
- `GET /api/invoices/{id}/pdf` - Télécharger PDF
- `POST /api/invoices/{id}/convert-to-invoice` - Convertir devis en facture

### Dépenses
- `GET /api/expenses` - Lister
- `POST /api/expenses` - Créer
- `GET /api/expenses/{id}` - Détails
- `PUT /api/expenses/{id}` - Modifier
- `DELETE /api/expenses/{id}` - Supprimer

### Dashboard
- `GET /api/dashboard/stats` - Statistiques
- `GET /api/dashboard/recent-activity` - Activité récente

## Notes importantes

1. **Sécurité**: Changez toujours `SECRET_KEY` en production
2. **CORS**: Ajoutez les domaines de votre frontend dans `CORS_ORIGINS`
3. **Base de données**: SQLite est pour le dev, utilisez PostgreSQL en production
4. **Fichiers**: Les PDF sont stockés dans `invoices/`, pensez à la sauvegarde

## Support

Pour toute question, consultez la documentation complète dans le README principal.
