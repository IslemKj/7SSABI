/**
 * Service Produits
 */
import api from './api';
import type { Product, ProductFormData } from '@/types';

export const productService = {
  /**
   * Récupérer tous les produits
   */
  async getAll(category?: string): Promise<Product[]> {
    const params = category ? { category } : {};
    const response = await api.get<Product[]>('/api/products', { params });
    return response.data;
  },

  /**
   * Récupérer un produit par ID
   */
  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  /**
   * Créer un produit
   */
  async create(data: ProductFormData): Promise<Product> {
    const response = await api.post<Product>('/api/products', data);
    return response.data;
  },

  /**
   * Mettre à jour un produit
   */
  async update(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const response = await api.put<Product>(`/api/products/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un produit
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },
};
