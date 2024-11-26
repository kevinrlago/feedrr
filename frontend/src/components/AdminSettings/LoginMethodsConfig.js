// frontend/src/components/AdminSettings/LoginMethodsConfig.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import axios from 'axios';

const LoginMethodsConfig = () => {
  const [config, setConfig] = useState({
    password_enabled: true,
    magic_link_enabled: false,
    oauth_google_enabled: false,
    oauth_github_enabled: false
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const response = await axios.get('/api/v1/admin/login-config');
    setConfig(response.data);
  };

  const handleChange = async (field) => {
    const newConfig = {
      ...config,
      [field]: !config[field]
    };
    
    try {
      await axios.put('/api/v1/admin/login-config', newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Login Methods
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={config.password_enabled}
              onChange={() => handleChange('password_enabled')}
            />
          }
          label="Password Login"
        />

        <FormControlLabel
          control={
            <Switch
              checked={config.magic_link_enabled}
              onChange={() => handleChange('magic_link_enabled')}
            />
          }
          label="Magic Link Login"
        />

        <FormControlLabel
          control={
            <Switch
              checked={config.oauth_google_enabled}
              onChange={() => handleChange('oauth_google_enabled')}
            />
          }
          label="Google OAuth"
        />

        <FormControlLabel
          control={
            <Switch
              checked={config.oauth_github_enabled}
              onChange={() => handleChange('oauth_github_enabled')}
            />
          }
          label="GitHub OAuth"
        />
      </CardContent>
    </Card>
  );
};

export default LoginMethodsConfig;