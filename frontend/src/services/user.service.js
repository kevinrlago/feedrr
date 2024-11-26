import { api } from './api';

export const userService = {
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  // otros métodos...
};