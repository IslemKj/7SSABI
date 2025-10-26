/**
 * Service Produits
 */
import api from './api';
import type { Product, ProductFormData } from '@/types';

/**
 * Convertir les valeurs string en number pour price et tva_rate
 */
const normalizeProduct = (product: any): Product => ({
  ...product,
  price: Number(product.price) || 0,
  tva_rate: Number(product.tva_rate) || 0,
});

export const productService = {
  /**
   * Récupérer tous les produits
   */
  async getAll(category?: string): Promise<Product[]> {
    const params = category ? { category } : {};
    const response = await api.get<Product[]>('/api/products/', { params });
    return response.data.map(normalizeProduct);
  },

  /**
   * Récupérer un produit par ID
   */
  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/api/products/${id}`);
    return normalizeProduct(response.data);
  },

  /**
   * Créer un produit
   */
  async create(data: ProductFormData): Promise<Product> {
    const response = await api.post<Product>('/api/products/', data);
    return normalizeProduct(response.data);
  },

  /**
   * Mettre à jour un produit
   */
  async update(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const response = await api.put<Product>(`/api/products/${id}`, data);
    return normalizeProduct(response.data);
  },

  /**
   * Supprimer un produit
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },
};
