import { api } from './api';

export const userService = {
  checkUsersExist: async () => {
    try {
      const response = await api.get('/api/v1/users/exists');
      return { exists: response.data.exists };
    } catch (error) {
      // Si hay error, asumimos que no hay usuarios
      if (error.response?.status === 401 || error.response?.status === 307) {
        return { exists: false };
      }
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const { exists } = await userService.checkUsersExist();
      
      if (!exists) {
        // Si no hay usuarios, usar endpoint para primer usuario
        return await userService.createFirstUser(userData);
      }
      
      // Si hay usuarios, usar endpoint normal
      const response = await api.post('/api/v1/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create user');
    }
  },

  createFirstUser: async (userData) => {
    try {
      const response = await api.post('/api/v1/users/first', {
        ...userData,
        role: 'ADMIN'
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 307) {
        // Retry with correct endpoint
        const response = await api.post('/api/v1/users/first', {
          ...userData,
          role: 'ADMIN'
        });
        return response.data;
      }
      throw new Error(error.response?.data?.detail || 'Failed to create first user');
    }
  },
  
  getAll: async () => {
    const response = await api.get('/api/v1/users');
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/api/v1/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
};