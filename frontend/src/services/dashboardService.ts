/**
 * Service Dashboard
 */
import api from './api';
import type { DashboardStats } from '@/types';

export const dashboardService = {
  /**
   * Récupérer les statistiques du dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  /**
   * Récupérer l'activité récente
   */
  async getRecentActivity(): Promise<any> {
    const response = await api.get('/api/dashboard/recent-activity');
    return response.data;
  },
};
