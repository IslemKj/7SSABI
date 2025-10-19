/**
 * Configuration de l'application
 */

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  appName: import.meta.env.VITE_APP_NAME || '7SSABI',
  tokenKey: '7ssabi_token',
  userKey: '7ssabi_user',
  
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
