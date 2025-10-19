/**
 * Service API - Configuration Axios
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/config/config';

// Créer une instance Axios
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  (axiosConfig) => {
    const token = localStorage.getItem(config.tokenKey);
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem(config.tokenKey);
      localStorage.removeItem(config.userKey);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
