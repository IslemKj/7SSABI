/**
 * Service de notifications
 */
import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  /**
   * Récupérer toutes les notifications
   */
  async getNotifications(unreadOnly: boolean = false): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/api/notifications', {
      params: { unread_only: unreadOnly }
    });
    return response.data;
  },

  /**
   * Récupérer le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ unread_count: number }>('/api/notifications/unread-count');
    return response.data.unread_count;
  },

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: number): Promise<void> {
    await api.put(`/api/notifications/${notificationId}/read`);
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/api/notifications/mark-all-read');
  },

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`);
  },
};
