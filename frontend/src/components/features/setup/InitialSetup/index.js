// src/components/features/setup/InitialSetup/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../services/user.service';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { api } from '../../../../services/api';

const InitialSetup = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    enableLogin: false,
    createAdmin: false,
    adminUser: {
      username: '',
      email: '',
      password: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkExistingUsers();
  }, []);

  const checkExistingUsers = async () => {
    try {
      const { exists } = await userService.checkUsersExist();
      if (exists) {
        // Si ya existen usuarios, redirigir a login
        navigate('/login');
      }
    } catch (err) {
      setError('Error checking users');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field) => {
    setConfig(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/v1/config/initial-setup', {
        loginEnabled: config.enableLogin,
        createAdmin: config.createAdmin,
        adminUser: config.createAdmin ? config.adminUser : null
      });

      // Redirigir a login después de la configuración inicial
      navigate('/login');
    } catch (err) {
      console.error('Initial setup error:', err);
      setError(err.response?.data?.detail || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Initial Setup
      </Typography>

      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={config.enableLogin}
                onChange={() => handleConfigChange('enableLogin')}
              />
            }
            label="Enable Authentication"
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            If disabled, no authentication will be required to access any part of the application
          </Typography>

          {config.enableLogin && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.createAdmin}
                    onChange={() => handleConfigChange('createAdmin')}
                  />
                }
                label="Create Admin User"
              />

              {config.createAdmin && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    value={config.adminUser.username}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      adminUser: { ...prev.adminUser, username: e.target.value }
                    }))}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    type="email"
                    value={config.adminUser.email}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      adminUser: { ...prev.adminUser, email: e.target.value }
                    }))}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    type="password"
                    value={config.adminUser.password}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      adminUser: { ...prev.adminUser, password: e.target.value }
                    }))}
                  />
                </Box>
              )}
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Configuration'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InitialSetup;