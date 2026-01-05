/**
 * Types pour l'application
 */

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  entreprise_name?: string;
  nif?: string;
  rc_number?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  is_active: boolean;
  role: string;
  created_at: string;
}

export interface UserStats {
  user_id: number;
  user_name: string;
  user_email: string;
  invoice_count: number;
  total_revenue: number;
  client_count: number;
  product_count: number;
  expense_count: number;
  is_active: boolean;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  username: string; // Backend utilise 'username' pour email
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  company_name: string;
  password: string;
  nif?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Client
export interface Client {
  id: number;
  user_id: number;
  name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  nif?: string;
  rc_number?: string;
  created_at: string;
}

export interface ClientFormData {
  name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  nif?: string;
  rc_number?: string;
}

// Product

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  unit_price: number; // Prix HT
  currency: string; // EUR, GBP, USD
  tva_rate: number; // Taux TVA (0, 9, 19)
  category: string; // 'produit' ou 'service'
  stock?: number; // Quantité en stock
  created_at: string;
}


export interface ProductFormData {
  name: string;
  description?: string;
  unit_price: number;
  currency: string;
  tva_rate: number;
  category: string;
  stock?: number;
}

// Invoice
export interface InvoiceItem {
  id?: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tva_rate?: number;
  total: number;
}

export interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  client?: Client; // Relation avec le client
  invoice_number: string;
  date: string;
  due_date?: string;
  currency: string; // EUR, GBP, USD
  exchange_rate?: number; // Taux de change vers DZD
  language: string; // fr, en
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  status: 'draft' | 'paid' | 'unpaid' | 'partial' | 'cancelled';
  paid_amount?: number;
  notes?: string;
  pdf_url?: string;
  is_quote: boolean;
  items?: InvoiceItem[];
  created_at: string;
}

export interface InvoiceFormData {
  client_id: number;
  invoice_number?: string;
  date: string;
  due_date?: string;
  currency?: string;
  language?: string;
  status?: 'draft' | 'paid' | 'unpaid' | 'partial' | 'cancelled';
  notes?: string;
  is_quote: boolean;
  total_ht?: number;
  total_tva?: number;
  total_ttc?: number;
  items?: Array<{
    product_id?: number;
    description: string;
    quantity: number;
    unit_price: number;
  }>;
}

// Expense
export interface Expense {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  date: string;
  description?: string;
  receipt_url?: string;
  created_at: string;
}

export interface ExpenseFormData {
  category: string;
  amount: number;
  date: string;
  description?: string;
}

// Dashboard
export interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  total_clients: number;
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  total_quotes: number;
}

// API Response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
