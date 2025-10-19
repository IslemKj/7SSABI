# 🚀 Guide de Démarrage Rapide - 7SSABI

## ✅ Installation Terminée

L'application **7SSABI** - Gestion & Comptabilité Simplifiée est maintenant complètement installée !

### 📊 État du Projet

✅ **Backend (FastAPI)** - Complet et fonctionnel
- 28 endpoints API REST
- Authentification JWT
- Génération PDF de factures
- Base de données PostgreSQL/SQLite
- Documentation Swagger automatique

✅ **Frontend (React + TypeScript)** - Complet et fonctionnel
- Interface Material-UI moderne et responsive
- 6 pages complètes (Login, Register, Dashboard, Clients, Produits, Factures, Dépenses)
- State management avec Zustand
- Routing avec React Router
- Communication API avec Axios

---

## 🌐 Accès aux Applications

### Backend API
- **URL**: http://localhost:8000
- **Documentation Swagger**: http://localhost:8000/docs
- **Documentation ReDoc**: http://localhost:8000/redoc

### Frontend Web
- **URL**: http://localhost:3000
- **Compte de test**:
  - Email: `admin@test.com`
  - Mot de passe: `admin123`

---

## 🎯 Fonctionnalités Disponibles

### 1. Authentification
- ✅ Inscription avec informations entreprise
- ✅ Connexion avec JWT token
- ✅ Routes protégées

### 2. Gestion Clients
- ✅ Créer, modifier, supprimer des clients
- ✅ Stockage NIF (Numéro d'Identification Fiscale algérien)
- ✅ Historique des factures par client

### 3. Gestion Produits & Services
- ✅ Catalogue de produits/services
- ✅ Prix HT avec TVA (0%, 9%, 19%)
- ✅ Catégorisation

### 4. Facturation
- ✅ Création de factures et devis
- ✅ Génération PDF automatique
- ✅ Numérotation automatique
- ✅ Statuts (Payée, Non payée, Partielle, Annulée)
- ✅ Calcul automatique TVA et totaux
- ✅ Téléchargement PDF

### 5. Gestion Dépenses
- ✅ Enregistrement des dépenses
- ✅ Catégorisation (Loyer, Salaires, Fournitures, etc.)
- ✅ Calcul du total des dépenses

### 6. Tableau de Bord
- ✅ Chiffre d'affaires total
- ✅ Nombre de clients
- ✅ Nombre de factures
- ✅ Total des dépenses
- ✅ Factures en attente / payées
- ✅ Nombre de devis

---

## 🛠️ Commandes Utiles

### Backend

```bash
# Démarrer le backend
cd backend
.\start.ps1

# Créer des données de test
python seed_data.py

# Lancer les tests
pytest
```

### Frontend

```bash
# Démarrer le frontend
cd frontend
npm run dev

# Build pour production
npm run build

# Lancer le build en production
npm run preview
```

---

## 📁 Structure du Projet

```
7SSABI/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/         # Modèles SQLAlchemy
│   │   ├── routes/         # Routes API
│   │   ├── schemas/        # Schémas Pydantic
│   │   ├── utils/          # Utilitaires (auth, PDF)
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Connexion DB
│   │   └── main.py         # Application FastAPI
│   ├── tests/              # Tests
│   ├── requirements.txt    # Dépendances Python
│   └── start.ps1           # Script de démarrage
│
└── frontend/               # Application React
    ├── src/
    │   ├── components/     # Composants réutilisables
    │   ├── pages/          # Pages de l'application
    │   ├── services/       # Services API
    │   ├── store/          # State management
    │   ├── types/          # Types TypeScript
    │   ├── config/         # Configuration
    │   ├── routes/         # Routing
    │   └── theme/          # Thème Material-UI
    ├── package.json        # Dépendances npm
    └── vite.config.ts      # Configuration Vite
```

---

## 🔐 Sécurité

- Authentification JWT avec tokens sécurisés
- Hachage des mots de passe avec bcrypt
- Protection CORS configurée
- Validation des données avec Pydantic
- Routes protégées côté frontend et backend

---

## 🇩🇿 Spécificités Algériennes

- **TVA**: 0%, 9%, 19%
- **NIF**: Numéro d'Identification Fiscale
- **Devise**: Dinar Algérien (DA)
- **Catégories de dépenses** adaptées au marché algérien

---

## 📝 Données de Test

Le script `seed_data.py` crée automatiquement :
- 1 utilisateur admin
- 5 clients
- 10 produits/services
- 8 factures (mix de factures et devis)
- 6 dépenses

**Identifiants**: `admin@test.com` / `admin123`

---

## 🚀 Prochaines Étapes

### Améliorations Suggérées

1. **Formulaire de création de factures**
   - Interface drag & drop pour les articles
   - Recherche de clients/produits
   - Aperçu PDF avant génération

2. **Dashboard avancé**
   - Graphiques Recharts (CA mensuel, dépenses par catégorie)
   - Top clients
   - Tendances

3. **Exports**
   - Export Excel des factures
   - Export PDF des dépenses
   - Rapports comptables

4. **Notifications**
   - Notifications toast avec react-toastify
   - Alertes pour factures échues
   - Rappels de paiement

5. **Multi-devises**
   - Support EUR, USD en plus du DA
   - Taux de change

6. **Responsive Mobile**
   - Application mobile React Native
   - PWA pour installation mobile

---

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation dans `/docs`
2. Vérifiez les logs du backend
3. Ouvrez la console navigateur (F12)

---

## 🎉 Bravo !

Votre application de gestion et comptabilité **7SSABI** est prête à l'emploi !

**Bon développement ! 🚀**
