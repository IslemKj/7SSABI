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

export const contactService = {
  /**
   * Send contact form message
   */
  async sendMessage(data: ContactFormData): Promise<ContactResponse> {
    const response = await api.post<ContactResponse>('/api/contact/send', data);
    return response.data;
  },
};
