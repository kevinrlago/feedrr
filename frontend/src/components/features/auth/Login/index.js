import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/token', {
        username: email,
        password: password,
      });
      setToken(response.data.access_token);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <StyledPaper>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="dense"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Login;