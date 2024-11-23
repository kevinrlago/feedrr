import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

function LoginConfig() {
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [loginMethod, setLoginMethod] = useState('basic');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/config/login');
      setLoginEnabled(response.data.loginEnabled);
      setLoginMethod(response.data.loginMethod);
    } catch (error) {
      console.error("Error fetching login config:", error);
    }
  };

  const saveConfig = async () => {
    try {
      await axios.post('/config/login', { loginEnabled, loginMethod });
      fetchConfig();
    } catch (error) {
      console.error("Error saving login config:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Configuración de Login
      </Typography>
      <StyledPaper>
        <FormControl component="fieldset">
          <FormLabel component="legend">Habilitar Login</FormLabel>
          <RadioGroup
            row
            value={loginEnabled ? 'true' : 'false'}
            onChange={(e) => setLoginEnabled(e.target.value === 'true')}
          >
            <FormControlLabel value="true" control={<Radio />} label="Sí" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        {loginEnabled && (
          <FormControl component="fieldset" style={{ marginTop: '16px' }}>
            <FormLabel component="legend">Método de Login</FormLabel>
            <RadioGroup
              row
              value={loginMethod}
              onChange={(e) => setLoginMethod(e.target.value)}
            >
              <FormControlLabel value="basic" control={<Radio />} label="Básico" />
              <FormControlLabel value="oidc" control={<Radio />} label="OIDC" />
            </RadioGroup>
          </FormControl>
        )}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={saveConfig}>
            Guardar Configuración
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default LoginConfig;