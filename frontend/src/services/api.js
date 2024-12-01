// frontend/src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const publicEndpoints = [
  '/api/v1/auth/token',
  '/api/v1/users/exists',
  '/api/v1/users/first',
  '/api/v1/config/login',
  '/api/v1/config/initial-setup'
];

api.interceptors.request.use((config) => {
  // Handle auth token requests
  if (config.url.includes('/api/v1/auth/token')) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const formData = new URLSearchParams();
    formData.append('username', config.data.username);
    formData.append('password', config.data.password);
    formData.append('grant_type', 'password');
    config.data = formData;
    return config;
  }
  
  // Don't add token for public endpoints
  if (!publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);