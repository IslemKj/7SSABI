/**
 * Service Dashboard
 */
import api from './api';
import type { DashboardStats } from '@/types';

export interface RevenueTrendData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TopClient {
  id: number;
  name: string;
  revenue: number;
  invoice_count: number;
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

export interface KPIs {
  current_month_revenue: number;
  previous_month_revenue: number;
  growth_percentage: number;
  average_invoice: number;
  conversion_rate: number;
}

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

  /**
   * Récupérer l'évolution du CA
   */
  async getRevenueTrend(months: number = 12): Promise<RevenueTrendData[]> {
    const response = await api.get<RevenueTrendData[]>(`/api/dashboard/analytics/revenue-trend?months=${months}`);
    return response.data;
  },

  /**
   * Récupérer les meilleurs clients
   */
  async getTopClients(limit: number = 5): Promise<TopClient[]> {
    const response = await api.get<TopClient[]>(`/api/dashboard/analytics/top-clients?limit=${limit}`);
    return response.data;
  },

  /**
   * Récupérer les produits les plus vendus
   */
  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    const response = await api.get<TopProduct[]>(`/api/dashboard/analytics/top-products?limit=${limit}`);
    return response.data;
  },

  /**
   * Récupérer les KPIs
   */
  async getKPIs(): Promise<KPIs> {
    const response = await api.get<KPIs>('/api/dashboard/analytics/kpis');
    return response.data;
  },
};
