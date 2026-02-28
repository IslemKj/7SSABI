/**
 * Configuration de l'application
 * Environment variables are loaded at build time
 * Make sure VITE_API_URL uses HTTPS in production
 */

// Determine API URL at runtime based on where the app is actually running.
// This bypasses all env var issues: on localhost use local backend, everywhere
// else (involeo.com, staging, etc.) use the production HTTPS backend.
const apiUrl: string =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
    : 'https://7ssabi-production.up.railway.app';

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
