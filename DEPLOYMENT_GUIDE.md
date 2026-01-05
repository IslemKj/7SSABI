# Guide de Déploiement - Involeo

## ✅ Checklist de Production

### 1. Sécurité

#### SSL/HTTPS ⚠️ PRIORITAIRE
- [ ] Obtenir un certificat SSL (Let's Encrypt gratuit ou payant)
- [ ] Configurer HTTPS sur le serveur
- [ ] Rediriger tout le trafic HTTP vers HTTPS
- [ ] Activer HSTS (HTTP Strict Transport Security)

```nginx
# Exemple Nginx
server {
    listen 80;
    server_name involeo.dz www.involeo.dz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name involeo.dz www.involeo.dz;
    
    ssl_certificate /etc/letsencrypt/live/involeo.dz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/involeo.dz/privkey.pem;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### Rate Limiting ⚠️ PRIORITAIRE
Protège contre les attaques DDoS et brute force.

**Backend - Ajouter slowapi:**
```bash
pip install slowapi
```

**Créer `backend/app/middleware/rate_limit.py`:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

limiter = Limiter(key_func=get_remote_address)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    raise HTTPException(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        detail="Trop de requêtes. Réessayez dans quelques instants."
    )
```

**Appliquer aux routes sensibles:**
```python
from app.middleware.rate_limit import limiter

@router.post("/login")
@limiter.limit("5/minute")  # 5 tentatives par minute
async def login(request: Request, ...):
    ...

@router.post("/register")
@limiter.limit("3/hour")  # 3 inscriptions par heure
async def register(request: Request, ...):
    ...
```

### 2. Base de Données

#### Sauvegardes Automatiques ⚠️ PRIORITAIRE
**Script de sauvegarde PostgreSQL:**
```bash
#!/bin/bash
# backend/scripts/backup_db.sh

# Configuration
DB_NAME="involeo_db"
DB_USER="postgres"
BACKUP_DIR="/var/backups/involeo"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="involeo_backup_$DATE.sql.gz"

# Créer le répertoire si nécessaire
mkdir -p $BACKUP_DIR

# Sauvegarde avec compression
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/$FILENAME

# Supprimer les sauvegardes de plus de 30 jours
find $BACKUP_DIR -name "involeo_backup_*.sql.gz" -mtime +30 -delete

echo "Backup créé: $FILENAME"
```

**Rendre le script exécutable:**
```bash
chmod +x backend/scripts/backup_db.sh
```

**Automatiser avec cron (tous les jours à 2h du matin):**
```bash
crontab -e
# Ajouter:
0 2 * * * /path/to/backend/scripts/backup_db.sh
```

#### Configuration de Production
```python
# backend/app/config.py

class Settings:
    # ...
    
    # Connexion pool pour performances
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600  # 1 heure
    
    # SSL pour production
    DB_SSL_MODE: str = "require"  # ou "verify-full"
```

### 3. Monitoring et Logging

#### Sentry - Suivi des Erreurs ⚠️ RECOMMANDÉ
**Installation:**
```bash
pip install sentry-sdk[fastapi]
```

**Configuration (`backend/app/main.py`):**
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn="https://YOUR_SENTRY_DSN",
    integrations=[
        FastApiIntegration(),
        SqlalchemyIntegration(),
    ],
    traces_sample_rate=0.1,  # 10% des transactions
    environment="production",
    release="involeo@1.0.0",
)
```

**Frontend (`frontend/src/main.tsx`):**
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  environment: "production",
});
```

#### Logs Structurés
```python
# backend/app/utils/logger.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data)

# Configuration
logger = logging.getLogger("involeo")
handler = logging.FileHandler("/var/log/involeo/app.log")
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

### 4. Performance

#### Redis pour Cache et Sessions
```bash
pip install redis[hiredis] aioredis
```

```python
# backend/app/cache.py
import redis
from functools import wraps
import json

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True,
    db=0
)

def cache_result(ttl=300):
    """Cache les résultats pendant ttl secondes"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

#### CDN pour Assets Statiques
- Utiliser Cloudflare (gratuit) pour:
  - Cache des assets (images, CSS, JS)
  - Protection DDoS
  - Compression automatique
  - Minification

### 5. Variables d'Environnement

#### Backend `.env` (PRODUCTION)
```bash
# Ne JAMAIS commiter ce fichier!

# Application
ENV=production
DEBUG=False
SECRET_KEY=<GENERER_UNE_CLE_FORTE_64_CHARS>
ALLOWED_ORIGINS=https://involeo.dz,https://www.involeo.dz

# Database
DATABASE_URL=postgresql://user:strong_password@localhost:5432/involeo_prod
DB_SSL_MODE=require

# Email (pour notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@involeo.dz
SMTP_PASSWORD=<APP_PASSWORD>

# Sentry
SENTRY_DSN=https://...

# Redis
REDIS_URL=redis://localhost:6379/0

# Rate Limiting
RATE_LIMIT_ENABLED=True
```

**Générer une clé secrète forte:**
```python
import secrets
print(secrets.token_urlsafe(64))
```

### 6. Conteneurisation (Docker)

#### Docker Compose Production
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - ENV=production
    restart: always
    depends_on:
      - db
      - redis
    volumes:
      - ./backend/logs:/var/log/involeo
    networks:
      - involeo-network

  frontend:
    build: ./frontend
    restart: always
    networks:
      - involeo-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: involeo_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: always
    networks:
      - involeo-network

  redis:
    image: redis:7-alpine
    restart: always
    networks:
      - involeo-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
      - frontend
    restart: always
    networks:
      - involeo-network

volumes:
  postgres_data:

networks:
  involeo-network:
```

### 7. Tests Avant Production

```bash
# Backend
cd backend
pytest tests/ --cov=app --cov-report=html

# Frontend
cd frontend
npm run test
npm run build  # Vérifier que le build fonctionne
```

### 8. Paiements Manuels (Phase 1)

#### Page de Contact pour Paiement
Créer une page simple avec:
- Instructions de virement bancaire
- RIB/IBAN de l'entreprise
- Numéro de téléphone pour cash
- Formulaire de notification de paiement

#### Workflow Manuel
1. Client demande un upgrade
2. Vous envoyez les coordonnées bancaires
3. Client effectue le virement
4. Client vous envoie la preuve de paiement
5. Vous upgrader manuellement le compte via script

**Script d'upgrade:**
```python
# backend/scripts/upgrade_user.py
import sys
from app.database import SessionLocal
from app.models.models import User

def upgrade_user(email: str, plan: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.subscription_plan = plan
        user.subscription_status = "active"
        db.commit()
        print(f"✅ User {email} upgraded to {plan}")
    else:
        print(f"❌ User {email} not found")
    db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python upgrade_user.py <email> <professional|business>")
        sys.exit(1)
    upgrade_user(sys.argv[1], sys.argv[2])
```

### 9. Checklist Finale Avant Lancement

- [ ] SSL configuré et testé
- [ ] Rate limiting actif
- [ ] Sauvegardes automatiques configurées
- [ ] Sentry configuré (backend + frontend)
- [ ] Variables d'environnement de production configurées
- [ ] Logs centralisés
- [ ] Email de notification configuré
- [ ] Tests passent à 100%
- [ ] Page Terms & Privacy publiées
- [ ] Page de contact/paiement manuel créée
- [ ] Domaine pointé vers le serveur
- [ ] Firewall configuré (ports 80, 443, 22 uniquement)
- [ ] Comptes de démonstration créés
- [ ] Documentation utilisateur prête
- [ ] Plan de communication (Instagram, etc.)

### 10. Après le Lancement

#### Semaine 1
- Surveiller les logs quotidiennement
- Vérifier que les sauvegardes fonctionnent
- Collecter les retours utilisateurs
- Corriger les bugs critiques rapidement

#### Mois 1
- Analyser les métriques (Sentry, analytics)
- Optimiser les performances si nécessaire
- Ajouter des fonctionnalités demandées
- Préparer la migration vers paiements automatiques

---

## 📞 Support Technique

Pour toute question technique, contactez:
- **Email Technique**: dev@involeo.dz
- **Emergency**: +213 XXX XXX XXX

## 🔐 Sécurité

**NE JAMAIS:**
- Commiter des fichiers `.env`
- Partager les clés secrètes
- Désactiver SSL en production
- Utiliser DEBUG=True en production
- Exposer des endpoints sans authentification
