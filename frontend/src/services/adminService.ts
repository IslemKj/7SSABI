/**
 * Service Admin
 */
import api from './api';
import type { User, UserStats, PaginatedResponse } from '@/types';

export const adminService = {
  /**
   * Récupérer tous les utilisateurs avec pagination
   */
  async getUsers(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedResponse<User>> {
    const params: any = { page, page_size: pageSize };
    if (search) params.search = search;
    const response = await api.get<PaginatedResponse<User>>('/api/admin/users/', { params });
    return response.data;
  },

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(userId: number): Promise<UserStats> {
    const response = await api.get<UserStats>(`/api/admin/users/${userId}/stats`);
    return response.data;
  },

  /**
   * Activer/désactiver un utilisateur
   */
  async toggleUserActive(userId: number): Promise<{ success: boolean; is_active: boolean }> {
    const response = await api.patch(`/api/admin/users/${userId}/toggle-active`);
    return response.data;
  },

  /**
   * Promouvoir un utilisateur en admin
   */
  async makeUserAdmin(userId: number): Promise<{ success: boolean; role: string }> {
    const response = await api.patch(`/api/admin/users/${userId}/make-admin`);
    return response.data;
  },

  /**
   * Retirer les droits admin d'un utilisateur
   */
  async removeUserAdmin(userId: number): Promise<{ success: boolean; role: string }> {
    const response = await api.patch(`/api/admin/users/${userId}/remove-admin`);
    return response.data;
  },

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/api/admin/users/${userId}`);
  },
};
