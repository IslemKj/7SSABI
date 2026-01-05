/**
 * Store d'authentification avec Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: authService.getToken(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { user: _user, token } = await authService.login(credentials);
          set({
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          // Fetch full user data
          const userData = await userService.getMe();
          set({ user: userData });
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Erreur de connexion';
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(data);
          set({ isLoading: false });
        } catch (error: any) {
          const message = error.response?.data?.detail || "Erreur d'inscription";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      loadUser: async () => {
        try {
          const userData = await userService.getMe();
          set({ user: userData });
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
