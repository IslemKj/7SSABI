# Configuration pour Votre Déploiement

## 🔗 Vos URLs

**Backend Railway:** `https://7ssabi-production.up.railway.app`

**Frontend Vercel:** (à compléter avec votre URL)

---

## 📋 Variables à ajouter sur Railway

Allez sur Railway → Votre service backend → Variables

Copiez-collez ces variables une par une:

```
SECRET_KEY=54260f7e43560b92e4c730465d4a1b23ff7a5660cca1ebbbff0f804b75ca1de7

DEBUG=False

SMTP_HOST=smtp.zoho.com

SMTP_PORT=587

SMTP_USERNAME=votre@email.com

SMTP_PASSWORD=votre-mot-de-passe-zoho

SMTP_FROM_EMAIL=votre@email.com

CONTACT_EMAIL=contact@involeo.com
```

**Après avoir ajouté votre URL Vercel, ajoutez aussi:**

```
FRONTEND_URL=https://votre-app.vercel.app

CORS_ORIGINS=["https://votre-app.vercel.app","http://localhost:5173"]
```

---

## 📋 Variable à ajouter sur Vercel

Allez sur Vercel → Settings → Environment Variables

```
Name: VITE_API_URL
Value: https://7ssabi-production.up.railway.app
```

**Important:** Après avoir ajouté cette variable, redéployez votre application Vercel!

---

## ✅ Checklist Finale

- [ ] PostgreSQL ajouté sur Railway (+ New → Database → PostgreSQL)
- [ ] Variables ajoutées sur Railway (voir ci-dessus)
- [ ] `VITE_API_URL` ajouté sur Vercel
- [ ] Application redéployée sur Vercel
- [ ] Railway a redéployé automatiquement
- [ ] Test: Inscription fonctionne
- [ ] Test: Connexion fonctionne
- [ ] Test: Formulaire de contact fonctionne

---

## 🧪 Test Rapide

1. Ouvrez votre site Vercel
2. Appuyez sur F12 pour ouvrir la console
3. Essayez de créer un compte
4. Si vous voyez des erreurs dans la console, envoyez-les moi

---

**Note:** Remplacez `votre@email.com` et `votre-mot-de-passe-zoho` par vos vraies credentials Zoho Mail!
