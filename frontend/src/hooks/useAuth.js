// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Token validation
  const validateToken = async (token) => {
    try {
      const response = await axios.get('/api/v1/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.message);
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with magic link
  const magicLinkLogin = async (email) => {
    try {
      await axios.post('/api/v1/auth/magic-link', { email });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Verify magic link token
  const verifyMagicLink = async (token) => {
    try {
      const response = await axios.post('/api/v1/auth/verify', { token });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    magicLinkLogin,
    verifyMagicLink
  };
};