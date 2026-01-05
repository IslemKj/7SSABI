/**
 * Service Clients
 */
import api from './api';
import type { Client, ClientFormData, PaginatedResponse } from '@/types';

export const clientService = {
  /**
   * Récupérer tous les clients avec pagination
   */
  async getAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Client>> {
    const response = await api.get<PaginatedResponse<Client>>('/api/clients/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  /**
   * Récupérer un client par ID
   */
  async getById(id: number): Promise<Client> {
    const response = await api.get<Client>(`/api/clients/${id}/`);
    return response.data;
  },

  /**
   * Créer un client
   */
  async create(data: ClientFormData): Promise<Client> {
    const response = await api.post<Client>('/api/clients/', data);
    return response.data;
  },

  /**
   * Mettre à jour un client
   */
  async update(id: number, data: Partial<ClientFormData>): Promise<Client> {
    const response = await api.put<Client>(`/api/clients/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un client
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/clients/${id}/`);
  },

  /**
   * Importer des clients depuis un CSV
   */
  async importCSV(file: File): Promise<{ success: boolean; created_count: number; errors: string[]; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/clients/import-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
