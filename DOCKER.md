# Guide Docker - 7SSABI

## Installation avec Docker

### Prérequis
- Docker Desktop installé
- Docker Compose installé

### Démarrage rapide

1. **Cloner le projet**
```bash
cd 7SSABI
```

2. **Configurer les variables d'environnement**
```bash
# Créer un fichier .env à la racine
echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
```

3. **Démarrer les services**
```bash
docker-compose up -d
```

4. **Vérifier les logs**
```bash
docker-compose logs -f backend
```

5. **Accéder à l'application**
- API: http://localhost:8000
- Documentation: http://localhost:8000/docs
- Database: localhost:5432

### Commandes Docker utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Reconstruire les images
docker-compose build

# Arrêter et supprimer tout (y compris les volumes)
docker-compose down -v

# Entrer dans le conteneur backend
docker exec -it 7ssabi_backend bash

# Accéder à la base de données
docker exec -it 7ssabi_db psql -U ssabi_user -d 7ssabi_db
```

### Structure des volumes

- `postgres_data`: Données PostgreSQL persistantes
- `invoices_data`: Factures PDF générées
- `receipts_data`: Reçus uploadés

### Développement avec Docker

Pour le développement, le code est monté en volume, donc les modifications sont reflétées automatiquement grâce au mode `--reload`.

### Production

Pour la production, modifier `docker-compose.yml`:
```yaml
# Retirer --reload
command: uvicorn app.main:app --host 0.0.0.0 --port 8000

# Utiliser des secrets
secrets:
  - db_password
  - jwt_secret
```

### Backup de la base de données

```bash
# Backup
docker exec 7ssabi_db pg_dump -U ssabi_user 7ssabi_db > backup.sql

# Restore
cat backup.sql | docker exec -i 7ssabi_db psql -U ssabi_user -d 7ssabi_db
```

### Troubleshooting

#### Le backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Reconstruire l'image
docker-compose build backend
docker-compose up -d backend
```

#### Problème de connexion à la base de données
```bash
# Vérifier que la DB est démarrée
docker-compose ps

# Tester la connexion
docker exec 7ssabi_backend psql -h db -U ssabi_user -d 7ssabi_db
```

#### Port déjà utilisé
Modifier les ports dans `docker-compose.yml`:
```yaml
ports:
  - "8080:8000"  # Au lieu de 8000:8000
```

## Déploiement en production

### Option 1: Docker Swarm
```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml 7ssabi
```

### Option 2: Kubernetes
Utiliser les fichiers dans `k8s/` (à créer)

### Option 3: Cloud (AWS, Azure, GCP)
- AWS ECS
- Azure Container Instances
- Google Cloud Run

## Monitoring

### Ajouter Prometheus et Grafana
```yaml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

## Sécurité

- Toujours utiliser des secrets pour les mots de passe
- Ne jamais committer le fichier `.env`
- Utiliser HTTPS en production
- Configurer un pare-feu
- Limiter l'accès à la base de données

---

**Note**: Ce guide est pour le développement et le déploiement. Adaptez selon vos besoins.
