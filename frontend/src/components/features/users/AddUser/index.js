// src/components/AddUser.js
import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../../../../hooks/useAuth';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setSuccess(true);
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        margin="normal"
        required
      />
      <Button 
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Add User
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>User created successfully!</Alert>}
    </Box>
  );
};

export default AddUser;