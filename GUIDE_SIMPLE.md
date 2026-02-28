# Guide Simple - Faire Fonctionner l'Application

## ✅ Ce qui est déjà fait
- ✅ Code poussé sur GitHub
- ✅ Railway connecté à Vercel
- ✅ Backend déployé sur Railway
- ✅ Frontend déployé sur Vercel

## 🔧 Ce qu'il reste à faire (5 étapes simples)

### Étape 1: Trouver l'URL du Backend Railway

1. Allez sur [railway.app](https://railway.app)
2. Ouvrez votre projet
3. Cliquez sur le service qui contient le backend
4. Cherchez l'URL publique (quelque chose comme `https://xxxxx.railway.app`)
5. **COPIEZ cette URL** - vous en aurez besoin

### Étape 2: Configurer Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Ouvrez votre projet Involeo
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez une nouvelle variable:
   - **Name**: `VITE_API_URL`
   - **Value**: L'URL Railway que vous avez copiée (ex: `https://xxxxx.railway.app`)
5. Cliquez sur **Save**
6. Allez dans **Deployments** → Redéployez la dernière version

### Étape 3: Configurer Railway

1. Sur Railway, dans votre service backend
2. Allez dans **Variables**
3. Ajoutez ces variables (si elles n'existent pas déjà):

```
SECRET_KEY=54260f7e43560b92e4c730465d4a1b23ff7a5660cca1ebbbff0f804b75ca1de7
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USERNAME=contact@involeo.com
SMTP_PASSWORD=Islam2003@abc
SMTP_FROM_EMAIL=votre@email.com
CONTACT_EMAIL=contact@involeo.com
DEBUG=False
```

4. Ajoutez aussi (en remplaçant par votre URL Vercel):
```
FRONTEND_URL=https://votre-app.vercel.app
CORS_ORIGINS=["https://votre-app.vercel.app","http://localhost:5173"]
```

5. Railway redéploiera automatiquement

### Étape 4: Ajouter PostgreSQL sur Railway

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Choisissez **"Database"** → **"PostgreSQL"**
3. Railway l'ajoutera automatiquement
4. La variable `DATABASE_URL` sera créée automatiquement

### Étape 5: Tester

1. Attendez que Vercel et Railway finissent de déployer (2-3 minutes)
2. Visitez votre site Vercel
3. Essayez de créer un compte sur `/register`
4. Essayez le formulaire de contact sur la page d'accueil

## 🆘 En cas de problème

### "Erreur d'inscription" ou formulaire ne marche pas

**Ouvrez la console du navigateur (F12):**
- Si vous voyez `CORS error` → Vérifiez `CORS_ORIGINS` sur Railway
- Si vous voyez `Network error` → Vérifiez `VITE_API_URL` sur Vercel
- Si vous voyez `500 error` → Vérifiez les logs Railway

### Comment voir les logs Railway?

1. Railway → Votre service → Onglet **"Deployments"**
2. Cliquez sur le dernier déploiement
3. Onglet **"Deploy Logs"** pour voir ce qui se passe

## 📝 URLs à noter

**Notez ici vos URLs:**

Railway Backend: `https://___________________.railway.app`

Vercel Frontend: `https://___________________.vercel.app`

---

**Une fois que tout fonctionne, vous pourrez:**
- Créer des comptes utilisateurs
- Se connecter
- Créer des factures
- Gérer des clients
- Recevoir des emails de contact
