/**
 * Service d'authentification
 */
import api from './api';
import { config } from '@/config/config';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    const { access_token } = response.data;
    
    // Stocker le token
    localStorage.setItem(config.tokenKey, access_token);
    
    // Récupérer les infos utilisateur (à implémenter côté backend si besoin)
    // Pour l'instant, on stocke juste le token
    
    return {
      token: access_token,
      user: {} as User, // À compléter avec un endpoint /me
    };
  },

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(config.tokenKey);
  },

  /**
   * Récupérer le token
   */
  getToken(): string | null {
    return localStorage.getItem(config.tokenKey);
  },

  /**
   * Demander une réinitialisation de mot de passe
   */
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/api/password-reset/request', { email });
  },

  /**
   * Vérifier la validité d'un token de réinitialisation
   */
  async verifyResetToken(token: string): Promise<void> {
    await api.post(`/api/password-reset/verify-token?token=${token}`);
  },

  /**
   * Confirmer la réinitialisation de mot de passe
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await api.post('/api/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  },
};
