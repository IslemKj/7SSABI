/**
 * Contact service for sending contact form messages
 */
import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface ContactRequest {
  id: number;
  email: string;
  name: string;
  subject: string;
  message: string;
  request_type: string;
  created_at: string;
  is_processed: boolean;
  notes: string | null;
}

export interface ContactRequestsResponse {
  items: ContactRequest[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const contactService = {
  /**
   * Send contact form message
   */
  async sendMessage(data: ContactFormData): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>('/api/contact/send', data);
    return response.data;
  },

  /**
   * Get all contact requests (admin only)
   */
  async getContactRequests(page = 1, pageSize = 10, unprocessedOnly = false): Promise<ContactRequestsResponse> {
    const response = await api.get('/api/admin/contact-requests/', {
      params: { page, page_size: pageSize, unprocessed_only: unprocessedOnly }
    });
    return response.data;
  },

  /**
   * Mark contact request as processed (admin only)
   */
  async markAsProcessed(requestId: number, notes?: string): Promise<void> {
    await api.patch(`/api/admin/contact-requests/${requestId}/process`, null, {
      params: notes ? { notes } : {}
    });
  },
};
