# 🛠️ Commandes Utiles - 7SSABI

## Backend (FastAPI)

### Installation & Configuration

```powershell
# Installation automatique
cd backend
.\install.ps1

# Installation manuelle
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

### Démarrage

```powershell
# Démarrage rapide
.\start.ps1

# Démarrage manuel
python run.py

# Avec uvicorn directement
uvicorn app.main:app --reload

# Sur un port différent
uvicorn app.main:app --reload --port 8080

# Avec logs détaillés
uvicorn app.main:app --reload --log-level debug
```

### Base de Données

```powershell
# Créer les tables
python -c "from app.database import create_tables; create_tables()"

# Générer des données de test
python seed_data.py

# Accéder à SQLite
sqlite3 7ssabi.db
.tables
.schema users
.exit

# Pour PostgreSQL
psql -U ssabi_user -d 7ssabi_db
\dt
\d users
\q
```

### Tests

```powershell
# Tous les tests
pytest

# Avec verbose
pytest -v

# Avec couverture
pytest --cov=app tests/

# Tests spécifiques
pytest tests/test_auth.py

# Un test en particulier
pytest tests/test_auth.py::test_register_user
```

### Dépendances

```powershell
# Installer une nouvelle dépendance
pip install nom-package

# Mettre à jour requirements.txt
pip freeze > requirements.txt

# Mettre à jour toutes les dépendances
pip install --upgrade -r requirements.txt
```

### Nettoyage

```powershell
# Supprimer les fichiers cache
Remove-Item -Recurse -Force __pycache__
Get-ChildItem -Include __pycache__ -Recurse | Remove-Item -Recurse -Force

# Supprimer la base SQLite
Remove-Item 7ssabi.db

# Réinitialiser l'environnement
Remove-Item -Recurse -Force venv
python -m venv venv
```

## Docker

### Construction & Démarrage

```bash
# Construire les images
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Démarrer avec logs
docker-compose up

# Reconstruire et démarrer
docker-compose up -d --build
```

### Gestion des Services

```bash
# Voir les services actifs
docker-compose ps

# Arrêter les services
docker-compose stop

# Arrêter et supprimer
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

### Logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f db

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

### Accès aux Conteneurs

```bash
# Backend
docker exec -it 7ssabi_backend bash
python
>>> from app.database import create_tables
>>> create_tables()

# Base de données
docker exec -it 7ssabi_db psql -U ssabi_user -d 7ssabi_db
```

### Maintenance

```bash
# Backup base de données
docker exec 7ssabi_db pg_dump -U ssabi_user 7ssabi_db > backup_$(date +%Y%m%d).sql

# Restore base de données
cat backup.sql | docker exec -i 7ssabi_db psql -U ssabi_user -d 7ssabi_db

# Nettoyer Docker
docker system prune -a
docker volume prune
```

## Git

### Configuration Initiale

```bash
git init
git add .
git commit -m "feat: initial commit with backend MVP"
git branch -M main
git remote add origin https://github.com/USERNAME/7SSABI.git
git push -u origin main
```

### Workflow de Développement

```bash
# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Voir les changements
git status
git diff

# Commit
git add .
git commit -m "feat: ajouter fonctionnalité X"

# Push
git push origin feature/nouvelle-fonctionnalite

# Mettre à jour depuis main
git checkout main
git pull
git checkout feature/nouvelle-fonctionnalite
git merge main
```

### Conventional Commits

```bash
# Nouvelle fonctionnalité
git commit -m "feat: ajouter export PDF"

# Correction de bug
git commit -m "fix: corriger calcul TVA"

# Documentation
git commit -m "docs: mettre à jour README"

# Refactoring
git commit -m "refactor: améliorer structure code"

# Tests
git commit -m "test: ajouter tests pour factures"

# Maintenance
git commit -m "chore: mettre à jour dépendances"
```

## API Testing

### Avec curl

```powershell
# Register
curl -X POST "http://localhost:8000/api/auth/register" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"Test123\"}'

# Login
curl -X POST "http://localhost:8000/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test123\"}'

# Utiliser l'API (avec token)
$token = "votre-token-ici"
curl -X GET "http://localhost:8000/api/clients" `
  -H "Authorization: Bearer $token"
```

### Avec Python

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "test@example.com", "password": "Test123"}
)
token = response.json()["access_token"]

# Utiliser l'API
headers = {"Authorization": f"Bearer {token}"}
clients = requests.get("http://localhost:8000/api/clients", headers=headers)
print(clients.json())
```

## Frontend (Une fois créé)

### Installation

```bash
cd frontend
npm install
# ou
yarn install
```

### Développement

```bash
# Démarrer le serveur de dev
npm run dev
# ou
yarn dev

# Build de production
npm run build
# ou
yarn build

# Preview du build
npm run preview
```

### Tests

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm test -- --coverage

# Tests end-to-end
npm run test:e2e
```

## Outils de Développement

### Python

```powershell
# Formater le code
black app/

# Linter
flake8 app/

# Type checking
mypy app/
```

### Documentation

```powershell
# Générer la documentation API
cd backend
python -m pydoc -w app.main
```

## Production

### Backend

```powershell
# Avec gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Variables d'environnement de production
$env:DEBUG="False"
$env:SECRET_KEY="votre-cle-secrete-production"
```

### Docker Production

```bash
# Build pour production
docker-compose -f docker-compose.prod.yml build

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### Healthcheck

```bash
# API health
curl http://localhost:8000/health

# Ping
curl http://localhost:8000/
```

### Logs

```bash
# Application logs
tail -f logs/app.log

# Access logs
tail -f logs/access.log

# Error logs
tail -f logs/error.log
```

## Dépannage

### Backend ne démarre pas

```powershell
# Vérifier Python
python --version

# Vérifier les dépendances
pip list

# Réinstaller les dépendances
pip install --force-reinstall -r requirements.txt

# Vérifier le port
netstat -ano | findstr :8000
```

### Erreur de base de données

```powershell
# SQLite: Supprimer et recréer
Remove-Item 7ssabi.db
python -c "from app.database import create_tables; create_tables()"

# PostgreSQL: Vérifier la connexion
psql -U ssabi_user -d 7ssabi_db -h localhost
```

### Problèmes d'import

```powershell
# Vérifier le PYTHONPATH
$env:PYTHONPATH = "."

# Ou ajouter au début du script
import sys
sys.path.insert(0, '.')
```

## Performance

### Profiling

```python
# Profiler l'application
python -m cProfile -o output.prof run.py

# Analyser les résultats
python -m pstats output.prof
```

### Base de données

```sql
-- Analyser les requêtes lentes (PostgreSQL)
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- Vérifier les index
SELECT * FROM pg_indexes WHERE tablename = 'invoices';
```

## Sécurité

### Générer une clé secrète

```powershell
# PowerShell
python -c "import secrets; print(secrets.token_hex(32))"

# Ou avec OpenSSL
openssl rand -hex 32
```

### Scanner les vulnérabilités

```powershell
# Python dependencies
pip install safety
safety check

# Docker images
docker scan 7ssabi_backend
```

---

**Astuce**: Sauvegardez ce fichier dans vos favoris pour référence rapide ! 📌
