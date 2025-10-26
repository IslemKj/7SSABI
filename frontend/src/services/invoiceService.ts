/**
 * Service Factures
 */
import api from './api';
import type { Invoice, InvoiceFormData } from '@/types';

export const invoiceService = {
  /**
   * Récupérer toutes les factures
   */
  async getAll(status?: string, isQuote?: boolean): Promise<Invoice[]> {
    const params: any = {};
    if (status) params.status = status;
    if (isQuote !== undefined) params.is_quote = isQuote;
    
    const response = await api.get<Invoice[]>('/api/invoices/', { params });
    return response.data;
  },

  /**
   * Récupérer une facture par ID
   */
  async getById(id: number): Promise<Invoice> {
    const response = await api.get<Invoice>(`/api/invoices/${id}/`);
    return response.data;
  },

  /**
   * Créer une facture
   */
  async create(data: InvoiceFormData): Promise<Invoice> {
    const response = await api.post<Invoice>('/api/invoices/', data);
    return response.data;
  },

  /**
   * Mettre à jour une facture
   */
  async update(id: number, data: Partial<InvoiceFormData>): Promise<Invoice> {
    const response = await api.put<Invoice>(`/api/invoices/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une facture
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/invoices/${id}/`);
  },

  /**
   * Télécharger le PDF d'une facture
   */
  async downloadPDF(id: number): Promise<Blob> {
    const response = await api.get(`/api/invoices/${id}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Convertir un devis en facture
   */
  async convertToInvoice(quoteId: number): Promise<Invoice> {
    const response = await api.post<Invoice>(`/api/invoices/${quoteId}/convert-to-invoice/`);
    return response.data;
  },
};
