/**
 * Configuration de l'application
 * Environment variables are loaded at build time
 * Make sure VITE_API_URL uses HTTPS in production
 */

// In production builds (import.meta.env.PROD = true), always force https://
// This runs at build time so Vite bakes the correct URL into the bundle
const rawApiUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const safeApiUrl: string = import.meta.env.PROD
  ? rawApiUrl.replace(/^http:\/\//, 'https://')
  : rawApiUrl;

export const config = {
  apiUrl: safeApiUrl,
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
