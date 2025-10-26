/**
 * Types pour l'application
 */

// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  entreprise_name?: string;
  nif?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
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
  created_at: string;
}

export interface ClientFormData {
  name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  nif?: string;
}

// Product
export interface Product {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  price: number; // Prix HT
  tva_rate: number; // Taux TVA (0, 9, 19)
  category: string; // 'produit' ou 'service'
  created_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  tva_rate: number;
  category: string;
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
