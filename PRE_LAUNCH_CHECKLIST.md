# 📋 Pre-Launch Checklist - Involeo

Print this checklist and check off each item as you complete it.

## Phase 1: Configuration (30 min)

### Contact Information
- [ ] Replace `+213 XXX XXX XXX` in `frontend/src/pages/LandingPage.tsx` (Line ~280)
- [ ] Replace `contact@involeo.dz` with real email in LandingPage
- [ ] Replace `+213 XXX XXX XXX` in `frontend/src/pages/legal/TermsPage.tsx`
- [ ] Replace `+213 XXX XXX XXX` in `frontend/src/pages/legal/PrivacyPage.tsx`
- [ ] Add full company address in PrivacyPage.tsx (Line ~130)
- [ ] Update bank details in LANDING_PAGE_README.md for payment instructions

### Environment Variables
- [ ] Generate strong SECRET_KEY:
  ```python
  import secrets
  print(secrets.token_urlsafe(64))
  ```
- [ ] Update `.env` with production DATABASE_URL
- [ ] Set `ENV=production` in `.env`
- [ ] Set `DEBUG=False` in `.env`
- [ ] Configure `ALLOWED_ORIGINS` with your domain
- [ ] Set `RATE_LIMIT_ENABLED=True` in `.env`

## Phase 2: Database Setup (10 min)

- [ ] Run subscription migration:
  ```bash
  cd backend
  python migrations/add_subscription_columns.py
  ```
- [ ] Verify migration successful (check console output)
- [ ] Create your admin account:
  ```bash
  python create_test_user.py  # Or register via UI
  python make_admin.py your@email.com
  ```

## Phase 3: Dependencies (10 min)

- [ ] Install Python dependencies:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
- [ ] Verify slowapi installed (for rate limiting)
- [ ] Frontend dependencies already installed (no changes needed)

## Phase 4: Testing (45 min)

### Frontend Tests
- [ ] Landing page loads (`http://localhost:3000` when logged out)
- [ ] "Commencer" button redirects to `/register`
- [ ] "Connexion" button redirects to `/login`
- [ ] Demo request form accepts email
- [ ] Footer links work (Terms, Privacy)
- [ ] Mobile responsive (test on phone or DevTools)

### Authentication Tests
- [ ] Register new account works
- [ ] Login with correct credentials works
- [ ] Login with wrong password fails
- [ ] Rate limiting blocks after 5 failed attempts (test in private window)
- [ ] Rate limiting allows after 1 minute wait

### Core Features Tests
- [ ] Dashboard loads after login
- [ ] Create new client
- [ ] Create new product
- [ ] Create new invoice
- [ ] Generate PDF from invoice
- [ ] PDF contains correct data
- [ ] Mark invoice as paid
- [ ] Dashboard shows updated revenue

### Admin Tests
- [ ] Admin can access `/admin/users`
- [ ] Non-admin cannot access `/admin/users` (403 error)
- [ ] Admin can view user stats
- [ ] Admin can toggle user active status
- [ ] Admin can delete user
- [ ] Admin cannot delete own account
- [ ] Admin cannot remove own admin role

### Subscription Tests
- [ ] View user subscription info:
  ```bash
  python scripts/upgrade_user.py your@email.com
  ```
- [ ] Upgrade user to premium:
  ```bash
  python scripts/upgrade_user.py your@email.com premium
  ```
- [ ] Verify plan changed in database
- [ ] Check user info shows new plan

## Phase 5: Security (15 min)

- [ ] Passwords are hashed (check database - should NOT see plain text)
- [ ] JWT tokens expire after timeout
- [ ] CORS only allows your domain
- [ ] API requires authentication for protected routes
- [ ] SQL injection protection (Pydantic validates inputs)
- [ ] XSS protection (React escapes by default)

## Phase 6: Backup Setup (10 min)

- [ ] Make backup script executable:
  ```bash
  chmod +x backend/scripts/backup_db.sh
  ```
- [ ] Test backup manually:
  ```bash
  ./backend/scripts/backup_db.sh
  ```
- [ ] Verify backup file created in `/var/backups/involeo/`
- [ ] Set up cron job (optional but recommended):
  ```bash
  crontab -e
  # Add: 0 2 * * * /path/to/backend/scripts/backup_db.sh
  ```

## Phase 7: Production Deployment (60 min)

### SSL/HTTPS
- [ ] Domain pointed to your server
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] HTTPS configured on web server
- [ ] HTTP redirects to HTTPS
- [ ] Test https://yourdomain.com loads

### Application Deployment
- [ ] Build frontend:
  ```bash
  cd frontend
  npm run build
  ```
- [ ] Deploy backend (FastAPI)
- [ ] Deploy frontend build
- [ ] Configure web server (Nginx/Apache)
- [ ] Test production URLs

### Final Production Tests
- [ ] Landing page loads on production
- [ ] Registration works on production
- [ ] Login works on production
- [ ] Can create invoice on production
- [ ] PDF generation works on production
- [ ] Admin panel accessible on production

## Phase 8: Marketing Preparation (30 min)

### Instagram Setup
- [ ] Create @involeo Instagram account
- [ ] Upload profile picture (`logos/profile.png`)
- [ ] Upload cover photo (`logos/cover.png`)
- [ ] Write bio (see LANDING_PAGE_README.md)
- [ ] Prepare 5-10 posts for launch week
- [ ] Schedule launch announcement post

### Demo Accounts
- [ ] Create demo account with sample data
- [ ] Create 2-3 sample clients
- [ ] Create 5-10 sample products
- [ ] Create 3-5 sample invoices
- [ ] Take screenshots for marketing

## Phase 9: Payment Setup (15 min)

- [ ] Prepare bank transfer instructions template
- [ ] Prepare cash payment instructions
- [ ] Create email template for payment requests
- [ ] Create email template for activation confirmation
- [ ] Test upgrade script one more time

## Phase 10: Monitoring Setup (30 min - Optional)

### Sentry (Recommended)
- [ ] Create free Sentry account
- [ ] Get DSN from Sentry
- [ ] Add Sentry to backend (see DEPLOYMENT_GUIDE.md)
- [ ] Add Sentry to frontend
- [ ] Test error tracking

### Analytics (Optional)
- [ ] Set up Google Analytics
- [ ] Add tracking code to frontend
- [ ] Verify events tracking

## Phase 11: Documentation (15 min)

- [ ] Create simple user guide (how to create invoice)
- [ ] Prepare FAQ document
- [ ] List common issues and solutions
- [ ] Create support email templates

## Phase 12: Final Review (30 min)

### Cross-browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] Test on Edge

### Mobile Testing
- [ ] Test on Android phone
- [ ] Test on iPhone (if available)
- [ ] Check responsiveness

### Content Review
- [ ] All text in French (no placeholders)
- [ ] No "Lorem ipsum" text
- [ ] No "XXX" placeholders for contact info
- [ ] Pricing is correct (5,000 DA for Premium)
- [ ] Links work (no 404 errors)
- [ ] Images load (or gracefully hide if missing)

## 🚀 Launch Day Checklist

### Morning
- [ ] Final backup of database
- [ ] Verify all services running
- [ ] Test critical user flows one last time
- [ ] Prepare customer support email/phone

### Launch (12:00 PM - midday recommended)
- [ ] Post Instagram launch announcement
- [ ] Share in WhatsApp groups
- [ ] Email friends/early supporters
- [ ] Monitor server logs for errors

### First Hour
- [ ] Respond to any questions quickly
- [ ] Fix any critical bugs immediately
- [ ] Monitor registration count

### First Day
- [ ] Check Sentry for errors (if configured)
- [ ] Respond to demo requests
- [ ] Thank early users
- [ ] Collect feedback

## 📊 Success Metrics - Week 1

Track these:
- [ ] Total registrations: ___
- [ ] Paid conversions: ___
- [ ] Invoices created: ___
- [ ] Active users (logged in last 7 days): ___
- [ ] Support requests: ___
- [ ] Bugs found: ___

## 🎯 Goals

**Week 1**: 
- 20-50 free registrations
- 1-3 paid users
- 0 critical bugs

**Month 1**:
- 100+ free users
- 10-20 paid users
- 5+ positive reviews

**Month 3**:
- 500+ free users
- 50+ paid users
- Automated payment integration

---

## ✅ Launch Approval

I certify that:
- [ ] All contact information is updated
- [ ] All tests pass
- [ ] Backups are configured
- [ ] SSL is working
- [ ] I have a plan for customer support
- [ ] I'm ready to launch!

**Signature**: _______________  
**Date**: _______________  
**Launch URL**: _______________

---

**Estimated Total Time**: 4-6 hours

**YOU'VE GOT THIS! 🚀**

*Remember: Perfect is the enemy of done. Launch with what you have, collect feedback, and iterate!*
