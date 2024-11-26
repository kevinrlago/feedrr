// frontend/src/components/MagicLinkLogin.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const MagicLinkLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('/api/v1/auth/magic-link', { email });
      setMessage('Magic link sent!');
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Magic Link Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Send Magic Link'}
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default MagicLinkLogin;