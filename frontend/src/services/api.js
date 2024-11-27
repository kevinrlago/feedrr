// frontend/src/services/api.js
import axios from 'axios';
import qs from 'qs';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Lista de endpoints públicos que no requieren autenticación
const publicEndpoints = [
  '/api/v1/users/exists',
  '/api/v1/users/first',
  '/token'
];

api.interceptors.request.use((config) => {
  // No añadir token para endpoints públicos
  if (!publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  // Transform request data to form-urlencoded for login
  if (config.url === '/token') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.data = qs.stringify(config.data);
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401 && !publicEndpoints.includes(error.config.url)) {
      // Redirigir a login solo si no es un endpoint público
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);