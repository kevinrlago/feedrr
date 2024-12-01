import { api } from './api';

export const userService = {
  checkUsersExist: async () => {
    try {
      const response = await api.get('/api/v1/users/exists');
      return { exists: response.data.exists };
    } catch (error) {
      console.error('Error checking users:', error);
      return { exists: false };
    }
  },

  createFirstUser: async (userData) => {
    try {
        // Check if username exists
        const exists = await userService.checkUsersExist();
        if (exists) {
            throw new Error("Users already exist in the system");
        }

        console.log('Creating first admin user:', userData);
        const response = await api.post('/api/v1/users/first', {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: 'ADMIN'
        });
        console.log('First user created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating first user:', error);
        if (error.response?.status === 400) {
            throw new Error("Username or email already exists");
        }
        throw new Error(error.response?.data?.detail || 'Failed to create first user');
    }
  },

  create: async (userData) => {
    try {
      // Check if it's the first user
      const { exists } = await userService.checkUsersExist();
      
      if (!exists) {
        console.log('No users exist, creating first admin user');
        return await userService.createFirstUser(userData);
      }

      // If users exist, use normal user creation endpoint
      const response = await api.post('/api/v1/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create user');
    }
  }
};