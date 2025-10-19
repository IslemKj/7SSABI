/**
 * Service Clients
 */
import api from './api';
import type { Client, ClientFormData } from '@/types';

export const clientService = {
  /**
   * Récupérer tous les clients
   */
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>('/api/clients');
    return response.data;
  },

  /**
   * Récupérer un client par ID
   */
  async getById(id: number): Promise<Client> {
    const response = await api.get<Client>(`/api/clients/${id}`);
    return response.data;
  },

  /**
   * Créer un client
   */
  async create(data: ClientFormData): Promise<Client> {
    const response = await api.post<Client>('/api/clients', data);
    return response.data;
  },

  /**
   * Mettre à jour un client
   */
  async update(id: number, data: Partial<ClientFormData>): Promise<Client> {
    const response = await api.put<Client>(`/api/clients/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un client
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/clients/${id}`);
  },
};
