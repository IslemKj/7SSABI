# Deployment Guide for Railway

## Prerequisites
1. GitHub account with your code pushed
2. Railway account (sign up at railway.app)

## Step-by-Step Deployment

### 1. Deploy Backend (FastAPI)
1. Go to railway.app and click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect Python and deploy backend

### 2. Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a DATABASE_URL environment variable

### 3. Set Environment Variables for Backend
In Railway dashboard, add these variables:
```
DATABASE_URL=<automatically set by Railway>
SECRET_KEY=<generate a secure random string>
FRONTEND_URL=<your frontend URL from step 4>
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USERNAME=<your zoho email>
SMTP_PASSWORD=<your zoho app password>
SMTP_FROM_EMAIL=<your zoho email>
CONTACT_EMAIL=contact@involeo.com
CORS_ORIGINS=<your frontend URL>
```

### 4. Deploy Frontend (React)
1. Click "New" → "GitHub Repo" again
2. Select the same repository
3. Set root directory to `frontend`
4. Set build command: `npm run build`
5. Set start command: `npm run preview` or use Vercel/Netlify instead

**Better Option for Frontend:**
Deploy frontend separately on Vercel or Netlify (free, faster):
- Push to GitHub
- Connect to Vercel/Netlify
- Set build command: `npm run build`
- Set output directory: `dist`
- Auto-deploys on every push

### 5. Run Database Migrations
In Railway backend terminal:
```bash
cd backend
python migrations/add_subscription_columns.py
```

### 6. Update Frontend API URL
In frontend, update the API URL to your Railway backend URL:
```typescript
// frontend/src/services/api.ts or config
const API_URL = 'https://your-backend.railway.app'
```

## Cost Estimate
- **Railway Free Tier**: $5 credit/month, 500 hours
- **Railway Hobby Plan**: $5/month (unlimited hours)
- **PostgreSQL**: Included in Railway
- **Frontend on Vercel/Netlify**: Free

## Production Checklist
- [ ] Push code to GitHub
- [ ] Deploy backend to Railway
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Deploy frontend (Railway or Vercel)
- [ ] Run database migrations
- [ ] Update API URLs
- [ ] Test signup/login flow
- [ ] Test email notifications
- [ ] Set custom domain (optional)

## Recommended Architecture
```
Frontend (Vercel/Netlify - Free)
    ↓
Backend (Railway - $5/month)
    ↓
PostgreSQL (Railway - Included)
```

Total cost: **$5/month** (after free tier)
