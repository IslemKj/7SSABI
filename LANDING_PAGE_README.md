# Landing Page & Payment Workflow

## 📋 Overview

The landing page is the first thing visitors see when they visit Involeo. It's designed to:
- Showcase the product features
- Display pricing plans clearly
- Capture leads through demo requests
- Convert visitors to registered users

## 🎨 Landing Page Components

### 1. Hero Section
- **Main Headline**: "Gérez votre entreprise avec simplicité"
- **Subheadline**: Value proposition for Algerian micro-entrepreneurs
- **CTA Buttons**: 
  - Primary: "Essai Gratuit" → Redirects to `/register`
  - Secondary: "Voir la Démo" → Scrolls to demo request section
- **Hero Image**: Dashboard preview (optional - currently shows placeholder)

### 2. Features Section
Six key features with icons:
- Professional Invoicing (Facturation Professionnelle)
- Client Management (Gestion Clients)
- Dashboard & Analytics (Tableau de Bord)
- Time Saving (Gain de Temps)
- Security (Sécurisé)
- Cloud Access (Accessible Partout)

### 3. Pricing Section
Single pricing tier:

| Plan | Price | Features |
|------|-------|----------|
| Involeo | 5,000 DA/mois | Everything unlimited - all features included |

**Payment-first model**: Users pay (CCP/bank transfer/cash) → You activate their account

### 4. Contact Section
- Email capture form
- Users contact you for payment details
- Simple onboarding process

### 5. Footer
- Quick Links (Login, Register, Terms, Privacy)
- Contact Information
- Copyright notice

## 💳 Manual Payment Workflow

### Simple Pay-First Process:

1. **User contacts you** (via form, email, phone, or Instagram)
2. **You send payment instructions**:
   ```
   Bienvenue chez Involeo!
   
   Tarif: 5,000 DA/mois
   
   Options de paiement:
   
   1. CCP (BaridiMob):
      - CCP: [Votre numéro CCP]
      - Nom: [Nom complet]
   
   2. Virement bancaire:
      - Banque: [Nom de votre banque]
      - RIB: [Votre RIB]
      - Titulaire: [Nom de l'entreprise]
   
   3. Paiement en espèces:
      - Téléphone: +213 XXX XXX XXX
      - Adresse: [Votre adresse]
   
   Après paiement, envoyez la preuve et nous activerons votre compte sous 24h.
   ```

3. **User makes payment and sends proof**
4. **You verify payment**
5. **Create their account**:
   ```bash
   cd backend
   python create_test_user.py  # Or have them register directly
   python scripts/upgrade_user.py user@email.com premium
   ```

### Admin Script Usage:

```bash
# View user information
python scripts/upgrade_user.py user@example.com

# Upgrade to premium plan
python scripts/upgrade_user.py user@example.com premium
```

## 📝 Required Updates Before Launch

### 1. Update Contact Information

Replace placeholder contact info in:

**Landing Page** (`frontend/src/pages/LandingPage.tsx`):
```typescript
// Line ~280
<Typography variant="body2">contact@involeo.dz</Typography>
<Typography variant="body2">+213 XXX XXX XXX</Typography>
```

**Terms Page** (`frontend/src/pages/legal/TermsPage.tsx`):
```typescript
// Bottom of page
Email : contact@involeo.dz
Téléphone : +213 XXX XXX XXX
```

**Privacy Page** (`frontend/src/pages/legal/PrivacyPage.tsx`):
```typescript
// Bottom of page
Email : privacy@involeo.dz
Téléphone : +213 XXX XXX XXX
Adresse : [Adresse complète de l'entreprise]
```

### 2. Add Real Payment Instructions Page

Create a dedicated page with your actual bank details:

**File**: `frontend/src/pages/PaymentInfoPage.tsx`
```typescript
// Include:
- Bank name
- RIB/IBAN
- Account holder name
- Payment reference format
- Contact phone for cash payments
- Expected processing time
```

### 3. Add Dashboard Hero Image (Optional)

If you want to show a dashboard preview on the landing page:

1. Take a screenshot of your dashboard
2. Save as `frontend/public/hero-dashboard.png`
3. The landing page will automatically display it

## 🚀 Deployment Steps

1. **Run the subscription migration**:
   ```bash
   cd backend
   python migrations/add_subscription_columns.py
   ```

2. **Install new dependencies**:
   ```bash
   pip install -r requirements.txt  # For slowapi (rate limiting)
   ```

3. **Test the landing page locally**:
   ```bash
   cd frontend
   npm run dev
   ```
   Visit `http://localhost:3000` (logged out)

4. **Update environment variables**:
   Add to `.env`:
   ```
   RATE_LIMIT_ENABLED=True
   ```

5. **Deploy to production**:
   - Build frontend: `npm run build`
   - Deploy backend with new dependencies
   - Test rate limiting on login/register

## 📧 Email Templates for Manual Payments

### Payment Request Email
```
Objet: Bienvenue chez Involeo - Instructions de paiement

Bonjour [Name],

Merci de votre intérêt pour Involeo!

TARIF: 5,000 DA/mois

OPTIONS DE PAIEMENT:

1. CCP (BaridiMob):
   - CCP: [Numéro]
   - Nom: [Nom]

2. VIREMENT BANCAIRE:
   - Banque: [Nom]
   - RIB: [RIB]
   - Titulaire: [Nom]

3. ESPÈCES:
   Appelez-nous au: +213 XXX XXX XXX

Après paiement, envoyez-nous:
- Photo/capture du reçu
- Votre nom et email

Activation sous 24h.

Cordialement,
L'équipe Involeo
```

### Activation Confirmation Email
```
Objet: Votre compte Involeo est activé!

Bonjour [Name],

Votre paiement a été reçu et confirmé.

Votre compte Involeo est maintenant actif!

ACCÈS COMPLET À:
✓ Facturation illimitée
✓ Gestion clients
✓ Export PDF professionnel
✓ Multi-devises
✓ Tableau de bord
✓ Support prioritaire

Connectez-vous maintenant:
https://involeo.dz/login

Email: [email]
Mot de passe: [Celui que vous avez créé]

Merci de votre confiance!

L'équipe Involeo
```

## 📊 Tracking Paid Users

To see all paid users:

```python
# Create backend/scripts/list_paid_users.py
from app.database import SessionLocal
from app.models.models import User

db = SessionLocal()
paid_users = db.query(User).filter(
    User.subscription_plan != 'free'
).all()

for user in paid_users:
    print(f"{user.email} - {user.subscription_plan} - {user.subscription_status}")
```

## 🔄 Future: Automated Payments

When you're ready to add automated payments:

1. **Chargily Integration** (Algerian payment gateway)
2. **Webhook handling for payment confirmation**
3. **Automatic subscription management**
4. **Email notifications**
5. **Subscription expiration handling**

For now, the manual system is:
- ✅ Simple to manage
- ✅ No integration complexity
- ✅ Direct customer interaction
- ✅ Full control over payments

## 📱 Marketing Materials

### Instagram Posts Ideas:
1. Feature highlights (one feature per post)
2. Customer testimonials (collect from early users)
3. Before/After (manual vs. Involeo)
4. Tips for entrepreneurs
5. Special launch offers

### Instagram Bio:
```
📊 Gestion simplifiée pour entrepreneurs algériens
💰 Facturation, clients, analytics
🆓 Essai gratuit
👇 Commencez maintenant
```

## ✅ Pre-Launch Checklist

- [ ] Update all contact information (email, phone)
- [ ] Add real bank details for payments
- [ ] Test landing page on mobile
- [ ] Run subscription migration
- [ ] Test user upgrade script
- [ ] Prepare payment instruction email template
- [ ] Prepare activation confirmation email
- [ ] Create Instagram account
- [ ] Prepare 5-10 initial Instagram posts
- [ ] Test full user journey (register → login → dashboard)
- [ ] Test admin can see subscription info
- [ ] Set up Google Analytics (optional but recommended)

## 🎯 Launch Day Tasks

1. Deploy to production
2. Post on Instagram with launch announcement
3. Monitor registrations
4. Respond to demo requests within 24h
5. Process payment requests same-day
6. Collect feedback from first users

Good luck with your launch! 🚀
