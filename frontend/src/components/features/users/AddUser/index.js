// src/components/AddUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../services/user.service';

import {
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress
} from '@mui/material';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'BASIC_USER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const { exists } = await userService.checkUsersExist();
        setIsFirstUser(!exists);
        if (!exists) {
          setFormData(prev => ({ ...prev, role: 'ADMIN' }));
        }
      } catch (err) {
        console.error('Error checking users:', err);
        setError(err.message);
      }
    };
    checkFirstUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isFirstUser) {
        console.log('Creating first admin user:', formData);
        await userService.createFirstUser(formData);
        navigate('/login');
      } else {
        console.log('Creating regular user:', formData);
        await userService.create(formData);
        navigate('/configuration/users/list');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isFirstUser ? 'Create First Admin User' : 'Add New User'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            label="Role"
          >
            <MenuItem value="BASIC_USER">Basic User</MenuItem>
            <MenuItem value="PRO_USER">Pro User</MenuItem>
            <MenuItem value="VALIDATOR">Validator</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create User'}
        </Button>
      </form>
    </Box>
  );
};

export default AddUser;