# Configuration du Frontend pour se connecter au Backend

## Problème actuel
Le frontend (localhost ou Vercel) ne peut pas se connecter au backend Railway.

## Solution

### Étape 1: Obtenir l'URL Railway
1. Allez sur votre projet Railway
2. Cliquez sur votre service backend
3. Dans l'onglet "Settings", vous trouverez l'URL publique (ex: `https://your-app-production.up.railway.app`)

### Étape 2: Configurer le Frontend Localement

Modifiez `frontend/.env`:
```env
VITE_API_URL=https://your-app-production.up.railway.app
```

Redémarrez le serveur de développement:
```bash
cd frontend
npm run dev
```

### Étape 3: Configurer Vercel (Production)

1. Allez sur votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-production.up.railway.app`
4. Redéployez depuis Vercel dashboard

### Étape 4: Mettre à jour CORS sur Railway

1. Allez sur Railway → votre service backend → Variables
2. Ajoutez ou modifiez:
   ```
   CORS_ORIGINS=["http://localhost:5173","https://your-app.vercel.app"]
   ```
3. Remplacez `https://your-app.vercel.app` par votre vraie URL Vercel

Railway redéploiera automatiquement.

### Étape 5: Tester

1. Visitez votre site (localhost ou Vercel)
2. Essayez de créer un compte
3. La page d'accueil devrait maintenant envoyer le formulaire de contact

## Vérification

Ouvrez la console du navigateur (F12) et vérifiez qu'il n'y a pas d'erreurs CORS ou de connexion refusée.
