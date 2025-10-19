/**
 * Service Dépenses
 */
import api from './api';
import type { Expense, ExpenseFormData } from '@/types';

export const expenseService = {
  /**
   * Récupérer toutes les dépenses
   */
  async getAll(category?: string, startDate?: string, endDate?: string): Promise<Expense[]> {
    const params: any = {};
    if (category) params.category = category;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get<Expense[]>('/api/expenses', { params });
    return response.data;
  },

  /**
   * Récupérer une dépense par ID
   */
  async getById(id: number): Promise<Expense> {
    const response = await api.get<Expense>(`/api/expenses/${id}`);
    return response.data;
  },

  /**
   * Créer une dépense
   */
  async create(data: ExpenseFormData): Promise<Expense> {
    const response = await api.post<Expense>('/api/expenses', data);
    return response.data;
  },

  /**
   * Mettre à jour une dépense
   */
  async update(id: number, data: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await api.put<Expense>(`/api/expenses/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une dépense
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/expenses/${id}`);
  },

  /**
   * Récupérer les catégories de dépenses
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/api/expenses/categories/list');
    return response.data;
  },
};
