// frontend/src/components/Settings/LoginMethodsConfig.js
import React, { useState, useEffect } from 'react';
import { Box, Card, Switch, FormControlLabel } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const LoginMethodsConfig = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const endpoint = user?.is_admin ? '/api/v1/login-config' : '/api/v1/login-config/public';
      const response = await axios.get(endpoint);
      setConfig(response.data);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (field) => {
    if (!user?.is_admin) return;
    
    try {
      const newConfig = { ...config, [field]: !config[field] };
      await axios.put('/api/v1/login-config', newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  return (
    <Card>
      <Box p={2}>
        <FormControlLabel
          control={
            <Switch
              checked={config?.is_public || false}
              onChange={() => handleChange('is_public')}
              disabled={!user?.is_admin}
            />
          }
          label="Public Access"
        />
        <FormControlLabel
          control={
            <Switch
              checked={config?.password_enabled || false}
              onChange={() => handleChange('password_enabled')}
              disabled={!user?.is_admin}
            />
          }
          label="Password Login"
        />
        <FormControlLabel
          control={
            <Switch
              checked={config?.magic_link_enabled || false}
              onChange={() => handleChange('magic_link_enabled')}
              disabled={!user?.is_admin}
            />
          }
          label="Magic Link"
        />
      </Box>
    </Card>
  );
};

export default LoginMethodsConfig;