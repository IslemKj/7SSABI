# ⚡ Test Rapide - 7SSABI

## 🎯 Objectif
Tester l'API 7SSABI en 5 minutes !

## 📋 Prérequis
- ✅ Python 3.9+ installé
- ✅ PowerShell ou terminal
- ✅ 5 minutes de votre temps

## 🚀 Étapes de Test

### Étape 1: Installation (2 minutes)

```powershell
# Ouvrir PowerShell dans le dossier 7SSABI
cd c:\Users\bakir\Desktop\7SSABI\backend

# Lancer le script d'installation
.\install.ps1
```

**Attendez** que toutes les dépendances soient installées... ☕

### Étape 2: Configuration (30 secondes)

Le fichier `.env` est déjà créé automatiquement avec SQLite.
Rien à faire ! ✅

### Étape 3: Données de Test (30 secondes)

```powershell
# Générer des données de test
python seed_data.py
```

**Résultat**: Compte créé avec quelques clients, produits et factures.

### Étape 4: Démarrer le Serveur (30 secondes)

```powershell
.\start.ps1
```

**Attendez** le message: "Application startup complete"

### Étape 5: Tester l'API (2 minutes)

#### Option A: Via le Navigateur (Recommandé)

1. Ouvrir: http://localhost:8000/docs
2. Cliquer sur "POST /api/auth/login"
3. Cliquer sur "Try it out"
4. Utiliser ces credentials:
   ```json
   {
     "email": "ahmed@example.com",
     "password": "Test123456"
   }
   ```
5. Cliquer "Execute"
6. **Copier le token** reçu
7. Cliquer sur "Authorize" (🔒 en haut)
8. Coller le token: `Bearer VOTRE_TOKEN`
9. Tester les autres endpoints ! 🎉

#### Option B: Via PowerShell/curl

```powershell
# 1. Se connecter et récupérer le token
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"ahmed@example.com","password":"Test123456"}'

$token = $response.access_token
Write-Host "Token: $token"

# 2. Récupérer la liste des clients
$headers = @{
    "Authorization" = "Bearer $token"
}

$clients = Invoke-RestMethod -Uri "http://localhost:8000/api/clients" `
  -Method GET `
  -Headers $headers

$clients | ConvertTo-Json
```

#### Option C: Via Postman/Insomnia

1. Importer: `backend\7SSABI_API_Collection.json`
2. Exécuter "Login"
3. Copier le token
4. Ajouter dans Headers: `Authorization: Bearer TOKEN`
5. Tester les endpoints

## ✅ Checklist de Vérification

Après avoir testé, vérifier que:

- [ ] Le serveur démarre sans erreur
- [ ] Login fonctionne et retourne un token
- [ ] GET /api/clients retourne 3 clients
- [ ] GET /api/products retourne 5 produits
- [ ] GET /api/invoices retourne 3 factures
- [ ] GET /api/dashboard/stats retourne les statistiques
- [ ] Documentation Swagger accessible sur /docs

## 🎯 Endpoints à Tester

### 1. Authentification
```
✓ POST /api/auth/login
✓ POST /api/auth/register
```

### 2. Clients
```
✓ GET /api/clients          (Lister)
✓ POST /api/clients         (Créer)
✓ GET /api/clients/{id}     (Détails)
```

### 3. Produits
```
✓ GET /api/products         (Lister)
✓ POST /api/products        (Créer)
```

### 4. Factures
```
✓ GET /api/invoices         (Lister)
✓ POST /api/invoices        (Créer)
✓ GET /api/invoices/{id}/pdf (Télécharger)
```

### 5. Dashboard
```
✓ GET /api/dashboard/stats
✓ GET /api/dashboard/recent-activity
```

## 📊 Résultats Attendus

### Dashboard Stats
```json
{
  "total_revenue": 69020.00,
  "total_expenses": 19500.00,
  "net_profit": 49520.00,
  "pending_invoices": 2,
  "total_clients": 3,
  "total_products": 5,
  ...
}
```

### Liste Clients
```json
[
  {
    "id": 1,
    "name": "Mohammed Karim",
    "company_name": "Karim Import-Export",
    "email": "karim@example.com",
    ...
  },
  ...
]
```

## 🎨 Test Visuel: Génération PDF

```powershell
# Dans votre navigateur ou via curl
# Télécharger le PDF de la facture #1
http://localhost:8000/api/invoices/1/pdf
```

**Vérifier**: Le PDF est généré dans `backend\invoices\`

## 🐛 En cas de Problème

### Erreur: Port 8000 déjà utilisé
```powershell
# Trouver le processus
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess

# Ou changer le port dans run.py
# port=8080 au lieu de 8000
```

### Erreur: Module not found
```powershell
# Réinstaller les dépendances
pip install -r requirements.txt
```

### Erreur: Database locked
```powershell
# Supprimer et recréer la base
Remove-Item 7ssabi.db
python seed_data.py
```

## 📸 Screenshots Attendus

### 1. Swagger UI
```
Vous devriez voir:
- Sections: Auth, Clients, Products, Invoices, Expenses, Dashboard
- Bouton "Authorize" en haut à droite
- Liste de tous les endpoints
```

### 2. Réponse Login
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Dashboard Stats
```
Toutes les valeurs numériques > 0
Graphiques mensuels avec des données
Top clients listés
```

## 🎉 Si Tout Fonctionne

**Félicitations ! 🎊**

Votre backend 7SSABI est opérationnel !

Prochaines étapes:
1. ✅ Explorer tous les endpoints dans Swagger
2. ✅ Créer vos propres clients/produits
3. ✅ Générer des factures
4. ✅ Voir le fichier ROADMAP.md pour la suite

## 📞 Besoin d'Aide ?

- 📖 Documentation: README.md
- 🛠️ Commandes: COMMANDS.md
- 🚀 Démarrage: QUICKSTART.md
- 🐛 Issues: Créer une issue GitHub

## ⏱️ Temps Total
- Installation: ~2 min
- Configuration: ~30 sec
- Données test: ~30 sec
- Démarrage: ~30 sec
- Tests: ~2 min
**TOTAL: ~5-6 minutes** ⚡

---

**Happy Testing! 🚀**

Si vous avez terminé avec succès tous les tests, vous êtes prêt à développer le frontend ou à personnaliser l'API selon vos besoins !
