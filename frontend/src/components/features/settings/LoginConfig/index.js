// src/components/features/settings/LoginConfig/index.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  TextField
} from '@mui/material';
import axios from 'axios';

const LoginConfig = () => {
  const [config, setConfig] = useState({
    loginEnabled: false,
    methods: {
      password: false,
      magicLink: false,
      google: false,
      github: false
    }
  });
  const [hasUsers, setHasUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    isAdmin: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUsersAndLoadConfig();
  }, []);

  const checkUsersAndLoadConfig = async () => {
    try {
      const [configResponse, usersResponse] = await Promise.all([
        axios.get('/api/v1/settings/login-config'),
        axios.get('/api/v1/users/count')
      ]);
      
      setConfig(configResponse.data);
      setHasUsers(usersResponse.data.count > 0);
    } catch (err) {
      setError('Failed to load configuration');
    }
  };

  const handleChange = async (field) => {
    if (!hasUsers && field !== 'loginEnabled') {
      setShowUserModal(true);
      return;
    }

    try {
      const newConfig = {
        ...config,
        [field]: typeof field === 'string' 
          ? !config[field]
          : {
              ...config.methods,
              [field]: !config.methods[field]
            }
      };
      
      await axios.put('/api/v1/settings/login-config', newConfig);
      setConfig(newConfig);
    } catch (err) {
      setError('Failed to update configuration');
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post('/api/v1/users', {
        ...newUser,
        role: 'ADMIN'
      });
      setHasUsers(true);
      setShowUserModal(false);
      // Enable selected login method
      handleChange('password');
    } catch (err) {
      setError('Failed to create admin user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Login Configuration
      </Typography>
      
      {!hasUsers && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must create an admin user before enabling login methods
        </Alert>
      )}

      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={config.loginEnabled}
                onChange={() => handleChange('loginEnabled')}
              />
            }
            label="Enable Login"
          />

          <FormControlLabel
            control={
              <Switch
                checked={config.methods.password}
                onChange={() => handleChange('password')}
                disabled={!config.loginEnabled || !hasUsers}
              />
            }
            label="Password Login"
          />

          {/* Other login method switches */}
        </CardContent>
      </Card>

      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)}>
        <DialogTitle>Create Admin User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            An admin user is required to enable login methods
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserModal(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create Admin User
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default LoginConfig;