# 7SSABI - Gestion et Comptabilité pour Micro-Entreprises Algériennes

## 📋 Description

**7SSABI** est une solution complète de gestion et comptabilité simplifiée conçue spécialement pour les micro-entrepreneurs, auto-entrepreneurs et petites entreprises algériennes. Elle permet de gérer facilement la facturation, les clients, les produits/services, les dépenses et de suivre ses performances financières.

## ✨ Fonctionnalités Principales

### 🧾 Facturation et Devis
- ✅ Création de devis et factures personnalisées
- ✅ Numérotation automatique (FA-2025-00001, DEV-2025-00001)
- ✅ Gestion de la TVA (19%, 9%, 0%)
- ✅ Génération de PDF professionnels
- ✅ Suivi des paiements (payé, impayé, partiel)
- ✅ Conversion devis → facture

### 👥 Gestion des Clients
- ✅ Fiche client complète (nom, entreprise, NIF, contacts)
- ✅ Historique des factures par client
- ✅ Suivi des paiements

### 📦 Produits et Services
- ✅ Catalogue de produits/services
- ✅ Prix d'achat et de vente
- ✅ Gestion du stock (optionnel)
- ✅ Catégorisation

### 💰 Comptabilité Simplifiée
- ✅ Suivi des recettes et dépenses
- ✅ Catégorisation des dépenses
- ✅ Calcul automatique du bénéfice net
- ✅ Visualisation du cashflow

### 📊 Tableau de Bord
- ✅ Chiffre d'affaires par période
- ✅ Dépenses par catégorie
- ✅ Bénéfice net
- ✅ Top 5 clients
- ✅ Graphiques et statistiques

## 🏗️ Architecture Technique

### Backend (API REST)
- **Framework**: FastAPI (Python)
- **Base de données**: PostgreSQL / SQLite (pour développement)
- **Authentification**: JWT (JSON Web Tokens)
- **Génération PDF**: ReportLab
- **ORM**: SQLAlchemy

### Frontend (À venir)
- **Framework**: React.js
- **UI Library**: Material-UI / Ant Design
- **État**: Redux / Context API
- **Graphiques**: Chart.js / Recharts

## 🚀 Installation et Configuration

### Prérequis
- Python 3.9+
- PostgreSQL (ou SQLite pour le développement)
- Node.js 16+ (pour le frontend)

### Installation du Backend

1. **Cloner le projet**
```bash
cd 7SSABI/backend
```

2. **Créer un environnement virtuel**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Installer les dépendances**
```powershell
pip install -r requirements.txt
```

4. **Configuration**
```powershell
# Copier le fichier d'exemple
copy .env.example .env

# Éditer le fichier .env avec vos paramètres
```

5. **Lancer le serveur**
```powershell
python run.py
```

Le serveur sera accessible sur `http://localhost:8000`
- Documentation API: `http://localhost:8000/docs`
- Documentation alternative: `http://localhost:8000/redoc`

## 📚 Documentation de l'API

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "motdepasse123",
  "entreprise_name": "Benali Services",
  "nif": "123456789",
  "phone": "0555123456",
  "address": "Alger, Algérie"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "motdepasse123"
}
```

Réponse:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Clients

#### Créer un client
```http
POST /api/clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mohammed Karim",
  "company_name": "Karim SARL",
  "phone": "0661234567",
  "email": "karim@example.com",
  "address": "Oran, Algérie",
  "nif": "987654321"
}
```

#### Lister les clients
```http
GET /api/clients
Authorization: Bearer {token}
```

### Produits/Services

#### Créer un produit
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Consultation Web",
  "description": "Service de consultation développement web",
  "unit_price": 5000.00,
  "category": "Services",
  "is_service": true
}
```

### Factures

#### Créer une facture
```http
POST /api/invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "client_id": 1,
  "date": "2025-10-19",
  "due_date": "2025-11-19",
  "tva_rate": 19.0,
  "is_quote": false,
  "items": [
    {
      "product_id": 1,
      "description": "Consultation Web",
      "quantity": 2,
      "unit_price": 5000.00
    }
  ]
}
```

#### Télécharger une facture en PDF
```http
GET /api/invoices/{invoice_id}/pdf
Authorization: Bearer {token}
```

### Dashboard

#### Obtenir les statistiques
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

Réponse:
```json
{
  "total_revenue": 150000.00,
  "total_expenses": 50000.00,
  "net_profit": 100000.00,
  "pending_invoices": 5,
  "pending_amount": 25000.00,
  "total_clients": 15,
  "total_products": 8,
  "monthly_revenue": [...],
  "expenses_by_category": [...],
  "top_clients": [...]
}
```

## 🗃️ Structure de la Base de Données

### Tables Principales

- **users**: Utilisateurs/entrepreneurs
- **clients**: Clients de l'entreprise
- **products**: Produits et services
- **invoices**: Factures et devis
- **invoice_items**: Lignes de facture
- **expenses**: Dépenses

### Relations

```
users (1) -----> (N) clients
users (1) -----> (N) products
users (1) -----> (N) invoices
users (1) -----> (N) expenses

clients (1) -----> (N) invoices
invoices (1) -----> (N) invoice_items
products (1) -----> (N) invoice_items
```

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation des données (Pydantic)
- ✅ Protection CORS
- ✅ Isolation des données par utilisateur

## 📝 TODO - Prochaines Étapes

### Backend
- [ ] Envoi d'emails (rappels, factures)
- [ ] Upload de fichiers (logo, reçus)
- [ ] Rapports Excel/CSV
- [ ] Calcul automatique de l'impôt algérien
- [ ] Multi-utilisateurs (rôles et permissions)

### Frontend
- [ ] Interface React complète
- [ ] Graphiques interactifs
- [ ] Mode sombre
- [ ] Support multilingue (FR/AR)
- [ ] Application mobile (React Native)

### Fonctionnalités Avancées
- [ ] Synchronisation cloud
- [ ] Backup automatique
- [ ] OCR pour les reçus
- [ ] Intégration bancaire
- [ ] Rapports fiscaux automatisés

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter.

---

**Fait avec ❤️ pour les entrepreneurs algériens**
