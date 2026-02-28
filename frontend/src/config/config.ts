/**
 * Configuration de l'application
 * Environment variables are loaded at build time
 * Make sure VITE_API_URL uses HTTPS in production
 */

// Hardcode the production URL as a literal so no platform env var can override it.
// Vite replaces import.meta.env.PROD with `true` at build time, so the production
// URL string is baked directly into the bundle — guaranteed to be https://.
const apiUrl: string = import.meta.env.PROD
  ? 'https://7ssabi-production.up.railway.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

export const config = {
  apiUrl,
  appName: import.meta.env.VITE_APP_NAME || 'Involeo',
  tokenKey: 'involeo_token',
  userKey: 'involeo_user',
  
  // TVA rates for Algeria
  tvaRates: [
    { value: 0, label: '0% (Exonéré)' },
    { value: 9, label: '9% (Réduit)' },
    { value: 19, label: '19% (Standard)' },
  ],
  
  // Invoice statuses
  invoiceStatuses: {
    paid: { label: 'Payé', color: 'success' },
    unpaid: { label: 'Impayé', color: 'error' },
    partial: { label: 'Partiel', color: 'warning' },
    cancelled: { label: 'Annulé', color: 'default' },
  },
  
  // Expense categories
  expenseCategories: [
    'Électricité',
    'Eau',
    'Gaz',
    'Internet',
    'Téléphone',
    'Carburant',
    'Transport',
    'Loyer',
    'Fournitures',
    'Comptabilité',
    'Assurances',
    'Publicité',
    'Formation',
    'Logiciels',
    'Salaires',
    'Autres',
  ],
};

export default config;
