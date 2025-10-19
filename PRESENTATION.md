# 🎨 7SSABI - Présentation Visuelle

```
 ███████╗███████╗███████╗ █████╗ ██████╗ ██╗
 ╚════██║██╔════╝██╔════╝██╔══██╗██╔══██╗██║
     ██╔╝███████╗███████╗███████║██████╔╝██║
    ██╔╝ ╚════██║╚════██║██╔══██║██╔══██╗██║
    ██║  ███████║███████║██║  ██║██████╔╝██║
    ╚═╝  ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝
    
    Gestion & Comptabilité - Micro-Entreprises Algériennes
```

## 🌟 Vue d'Ensemble

**7SSABI** est une solution complète de gestion pour les entrepreneurs algériens, combinant facturation, comptabilité et suivi de performance dans une interface simple et intuitive.

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │Dashboard │  │ Factures │  │ Clients  │  │ Produits ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │   Auth   │  │   CRUD   │  │Dashboard │  │   PDF    ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└────────────────────┬────────────────────────────────────┘
                     │ SQLAlchemy ORM
                     ↓
┌─────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL/SQLite)                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │Users │  │Clients│ │Products│ │Invoices│ │Expenses│   │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### 1. Authentification
```
User → Login Form → POST /api/auth/login → JWT Token → Authorized Access
```

### 2. Création de Facture
```
User Input
    ↓
Select Client & Products
    ↓
Calculate Totals (HT + TVA)
    ↓
POST /api/invoices
    ↓
Generate PDF
    ↓
Store in Database
```

### 3. Dashboard Statistiques
```
GET /api/dashboard/stats
    ↓
Aggregate Invoices (Revenue)
    ↓
Aggregate Expenses
    ↓
Calculate Net Profit
    ↓
Format & Return JSON
```

## 📦 Modules Principaux

### 🔐 Module Authentification
```
┌─────────────────┐
│  Registration   │
│  ┌───────────┐  │
│  │ User Info │  │
│  │ Password  │  │
│  └───────────┘  │
│       ↓         │
│  Hash Password  │
│       ↓         │
│   Save to DB    │
└─────────────────┘

┌─────────────────┐
│     Login       │
│  ┌───────────┐  │
│  │   Email   │  │
│  │  Password │  │
│  └───────────┘  │
│       ↓         │
│ Verify Password │
│       ↓         │
│ Generate JWT    │
│       ↓         │
│  Return Token   │
└─────────────────┘
```

### 🧾 Module Facturation
```
┌──────────────────────────────────────┐
│         Create Invoice               │
│                                      │
│  1. Select Client                    │
│     ├─ Name                          │
│     ├─ Company                       │
│     └─ NIF                           │
│                                      │
│  2. Add Products/Services            │
│     ├─ Description                   │
│     ├─ Quantity                      │
│     ├─ Unit Price                    │
│     └─ Total                         │
│                                      │
│  3. Calculate                        │
│     ├─ Total HT                      │
│     ├─ TVA (19%, 9%, 0%)             │
│     └─ Total TTC                     │
│                                      │
│  4. Generate                         │
│     ├─ Invoice Number (FA-2025-001)  │
│     ├─ PDF Document                  │
│     └─ Save to Database              │
└──────────────────────────────────────┘
```

### 💰 Module Dépenses
```
┌──────────────────┐
│  Add Expense     │
│                  │
│  Category ───────┤
│  │               │
│  ├─ Internet     │
│  ├─ Électricité  │
│  ├─ Transport    │
│  └─ Autres       │
│                  │
│  Amount          │
│  Date            │
│  Description     │
│                  │
│  [Save]          │
└──────────────────┘
```

### 📊 Module Dashboard
```
┌─────────────────────────────────────────────────┐
│              DASHBOARD                          │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Revenue  │  │ Expenses │  │  Profit  │     │
│  │ 150,000  │  │  50,000  │  │ 100,000  │     │
│  │   DZD    │  │   DZD    │  │   DZD    │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Monthly Revenue Chart                  │   │
│  │  ▂▃▅▇▅▆▇▆▅▄▃▂                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────────┐  ┌─────────────────────┐    │
│  │ Top Clients  │  │ Recent Invoices     │    │
│  │ 1. Client A  │  │ FA-2025-001 - Paid  │    │
│  │ 2. Client B  │  │ FA-2025-002 - Due   │    │
│  │ 3. Client C  │  │ FA-2025-003 - Paid  │    │
│  └──────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## 🎯 Exemple d'Utilisation

### Scénario: Créer une Facture

```
1. 👤 Login
   └─> Enter email & password
       └─> Receive JWT token

2. 👥 Create/Select Client
   └─> Mohammed Karim
       ├─ Company: Karim Import-Export
       ├─ NIF: 987654321098765
       └─> [Save]

3. 📦 Create/Select Products
   └─> Consultation Web - 8,000 DZD
   └─> Development Site - 50,000 DZD
       └─> [Save]

4. 🧾 Create Invoice
   ├─ Client: Mohammed Karim
   ├─ Items:
   │  ├─ Consultation Web x2 = 16,000 DZD
   │  └─ Development Site x1 = 50,000 DZD
   ├─ Total HT: 66,000 DZD
   ├─ TVA (19%): 12,540 DZD
   ├─ Total TTC: 78,540 DZD
   └─> [Generate Invoice]

5. 📄 Result
   ├─ Invoice Number: FA-2025-00001
   ├─ PDF Generated ✓
   ├─ Saved to Database ✓
   └─> [Download PDF] / [Send Email]
```

## 📈 Statistiques Temps Réel

```
Dashboard Updates Every:
├─ Revenue: On Invoice Payment
├─ Expenses: On Expense Add
├─ Profit: Auto-calculated
└─ Charts: Daily/Weekly/Monthly
```

## 🔒 Sécurité

```
┌──────────────────────────────────┐
│      Security Layers             │
│                                  │
│  1. JWT Authentication           │
│     └─> Token Expiration (30min)│
│                                  │
│  2. Password Hashing             │
│     └─> bcrypt Algorithm         │
│                                  │
│  3. Input Validation             │
│     └─> Pydantic Schemas         │
│                                  │
│  4. CORS Protection              │
│     └─> Allowed Origins          │
│                                  │
│  5. SQL Injection Prevention     │
│     └─> SQLAlchemy ORM           │
└──────────────────────────────────┘
```

## 🚀 Performance

```
API Response Times:
├─ Authentication: ~100ms
├─ CRUD Operations: ~50-150ms
├─ Dashboard Stats: ~200ms
└─ PDF Generation: ~500ms
```

## 📱 Roadmap Visuel

```
Version 1.0 (Current)          Version 2.0 (Q1 2026)         Version 3.0 (Q2 2026)
─────────────────────          ──────────────────────        ──────────────────────
┌─────────────────┐            ┌─────────────────┐          ┌─────────────────┐
│  Backend API    │            │  React Frontend │          │  Mobile App     │
│  ✓ FastAPI      │            │  □ Dashboard    │          │  □ iOS          │
│  ✓ PostgreSQL   │            │  □ Forms        │          │  □ Android      │
│  ✓ JWT Auth     │            │  □ Charts       │          │  □ Offline      │
│  ✓ PDF Gen      │            │  □ Dark Mode    │          │  □ Sync         │
└─────────────────┘            └─────────────────┘          └─────────────────┘
```

## 🎨 UI/UX Preview (Frontend à venir)

```
┌────────────────────────────────────────────────────┐
│  🏠 7SSABI                    👤 Ahmed    [Logout] │
├────────────────────────────────────────────────────┤
│ 📊 Dashboard  │  👥 Clients  │  📦 Products       │
│ 🧾 Invoices   │  💰 Expenses │  ⚙️ Settings       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Welcome back, Ahmed! 👋                          │
│                                                    │
│  [150,000 DZD]  [50,000 DZD]  [100,000 DZD]      │
│   Revenue        Expenses       Profit            │
│                                                    │
│  📈 Monthly Performance                           │
│  ▂▃▅▇█▇▆▅▄▃▂▁                                    │
│                                                    │
│  Recent Invoices                                  │
│  • FA-2025-001 - Client A - 25,000 DZD [Paid]    │
│  • FA-2025-002 - Client B - 15,000 DZD [Due]     │
│                                                    │
└────────────────────────────────────────────────────┘
```

## 🎉 Points Forts

```
✓ 100% API REST Fonctionnelle
✓ Documentation Complète
✓ Docker Ready
✓ Tests Unitaires
✓ Sécurité JWT
✓ Génération PDF Automatique
✓ Calcul TVA Algérienne
✓ Multi-devises (DZD)
✓ Factures & Devis
✓ Dashboard Statistiques
```

---

**7SSABI** - Simplifions la gestion pour les entrepreneurs algériens 🇩🇿

Made with ❤️ in Algeria
