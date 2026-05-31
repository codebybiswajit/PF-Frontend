import axios from 'axios';
import type { AuthResponse, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: Omit<User, '_id'> & { password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data.user;
  },

  chat: async (messages: { role: string; content: string }[], options?: { signal?: AbortSignal }): Promise<any> => {
    const res = await api.post('/auth/chat', { messages }, options);
    return res.data;
  },

  updateProfile: async (id: string, data: Partial<User>): Promise<{ user: User }> => {
    const res = await api.put<{ user: User }>(`/users/${id}/profile`, data);
    return res.data;
  },

  getPublicPortfolio: async (slug: string): Promise<{ user: User }> => {
    const res = await api.get<{ user: User }>(`/users/public/${slug}`);
    return res.data;
  },

  getPublicUserById: async (id: string): Promise<{ user: User }> => {
    const res = await api.get<{ user: User }>(`/users/${id}/resume`);
    return res.data;
  },
};

export default api;
