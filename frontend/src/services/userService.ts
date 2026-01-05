import api from './api';
import type { User } from '@/types';

function toApiUser(data: Partial<User>) {
  // Map frontend fields to backend aliases
  const mapped: any = { ...data };
  if ('name' in mapped) {
    mapped.full_name = mapped.name;
    delete mapped.name;
  }
  if ('entreprise_name' in mapped) {
    mapped.company_name = mapped.entreprise_name;
    delete mapped.entreprise_name;
  }
  return mapped;
}

function fromApiUser(data: any): User {
  // Map backend aliases to frontend fields
  return {
    ...data,
    name: data.full_name ?? data.name ?? '',
    entreprise_name: data.company_name ?? data.entreprise_name ?? '',
    rc_number: data.rc_number ?? '',
  };
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get('/api/users/me');
    return fromApiUser(response.data);
  },

  async updateMe(data: Partial<User>): Promise<User> {
    const response = await api.put('/api/users/me', toApiUser(data));
    return fromApiUser(response.data);
  },

  async uploadLogo(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/users/me/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return fromApiUser(response.data);
  },
};
