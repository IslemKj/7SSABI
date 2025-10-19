# 🧪 Guide de Test - 7SSABI

## 📍 URLs de l'Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentation Swagger**: http://localhost:8000/docs
- **Documentation ReDoc**: http://localhost:8000/redoc

---

## 🔐 Créer un Compte de Test

### Option 1: Via l'Interface Frontend (Recommandé)

1. Ouvrez http://localhost:3000
2. Cliquez sur "Pas encore de compte ? S'inscrire"
3. Remplissez le formulaire:
   - **Email**: `test@example.com`
   - **Nom complet**: `Test User`
   - **Nom de l'entreprise**: `Test Company`
   - **NIF** (optionnel): `000000000000000`
   - **Téléphone** (optionnel): `0555000000`
   - **Adresse** (optionnelle): `Test Address`
   - **Mot de passe**: `Test123!`
   - **Confirmer le mot de passe**: `Test123!`
4. Cliquez sur "S'inscrire"
5. Retournez sur la page de connexion
6. Connectez-vous avec vos identifiants

### Option 2: Via Swagger UI

1. Ouvrez http://localhost:8000/docs
2. Cherchez l'endpoint `POST /api/auth/register`
3. Cliquez sur "Try it out"
4. Modifiez le JSON exemple:
```json
{
  "full_name": "Test User",
  "email": "test@example.com",
  "company_name": "Test Company",
  "password": "Test123!",
  "nif": "000000000000000",
  "phone": "0555000000",
  "address": "Test Address, Alger"
}
```
5. Cliquez sur "Execute"
6. Vérifiez la réponse 201 Created

---

## 🧪 Tester la Connexion

### Frontend
1. Allez sur http://localhost:3000
2. Entrez:
   - **Email**: votre email d'inscription
   - **Mot de passe**: votre mot de passe
3. Cliquez sur "Se connecter"

### Swagger UI
1. Ouvrez http://localhost:8000/docs
2. Cherchez `POST /api/auth/login`
3. Cliquez sur "Try it out"
4. Entrez:
```json
{
  "username": "test@example.com",
  "password": "Test123!"
}
```
5. Vous recevrez un token d'accès

---

## 📊 Tester les Fonctionnalités

### 1. Dashboard
- URL: http://localhost:3000/
- Affiche les statistiques globales

### 2. Clients
- URL: http://localhost:3000/clients
- ➕ Créer un nouveau client
- ✏️ Modifier un client existant
- 🗑️ Supprimer un client

### 3. Produits & Services
- URL: http://localhost:3000/products
- ➕ Créer un produit/service avec prix HT et TVA
- TVA: 0%, 9%, ou 19%
- Catégorie: Produit ou Service

### 4. Factures & Devis
- URL: http://localhost:3000/invoices
- 📄 Voir les factures
- 📋 Voir les devis (onglet "Devis")
- 📥 Télécharger PDF
- Statuts: Payée, Non payée, Partielle, Annulée

### 5. Dépenses
- URL: http://localhost:3000/expenses
- ➕ Enregistrer une dépense
- Catégories algériennes pré-configurées
- 💰 Total automatique

---

## 🔧 Résolution de Problèmes

### Erreur 422 sur /api/auth/login
- **Cause**: Le format des données ne correspond pas
- **Solution**: Utilisez "username" pour l'email dans la requête

### Erreur 401 Unauthorized
- **Cause**: Email ou mot de passe incorrect
- **Solution**: Vérifiez vos identifiants ou créez un nouveau compte

### Frontend ne se connecte pas au backend
- **Vérifiez**: Le backend tourne sur http://localhost:8000
- **Vérifiez**: Le fichier `.env` dans frontend contient:
  ```
  VITE_API_URL=http://localhost:8000
  ```

### Base de données vide
- Le fichier `app.db` sera créé automatiquement au premier lancement
- Les données sont persistées dans ce fichier SQLite

---

## 🎯 Prochains Tests

1. **Créer 2-3 clients**
2. **Créer 5-10 produits** avec différentes TVA
3. **Créer une facture** pour un client
4. **Enregistrer quelques dépenses**
5. **Consulter le dashboard** pour voir les statistiques

---

## 📱 Test Responsive

Pour tester le responsive mobile:
1. Ouvrez les DevTools (F12)
2. Activez le mode "Toggle device toolbar" (Ctrl+Shift+M)
3. Testez avec différentes tailles d'écran
4. La sidebar devient un drawer mobile automatiquement

---

## ✅ Checklist de Test

- [ ] Inscription d'un nouveau compte
- [ ] Connexion avec le compte créé
- [ ] Accès au dashboard
- [ ] Création d'un client
- [ ] Modification d'un client
- [ ] Création d'un produit
- [ ] Création d'une dépense
- [ ] Consultation des listes
- [ ] Test sur mobile (responsive)
- [ ] Déconnexion
- [ ] Reconnexion

---

**Bonne exploration de 7SSABI ! 🚀**
