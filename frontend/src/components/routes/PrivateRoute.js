// src/components/routes/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';
import { userService } from '../../services/user.service';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, loginRequired } = useAuth();
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [checkingFirstUser, setCheckingFirstUser] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const { exists } = await userService.checkUsersExist();
        setIsFirstUser(!exists);
      } catch (error) {
        console.error('Error checking users:', error);
      } finally {
        setCheckingFirstUser(false);
      }
    };
    checkFirstUser();
  }, []);

  if (loading || checkingFirstUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Si el login no está habilitado, permitir acceso
  if (!loginRequired) {
    return children;
  }

  // Si es la ruta de creación del primer usuario y no hay usuarios, permitir acceso
  if (location.pathname === '/configuration/users/add' && isFirstUser) {
    return children;
  }

  // Si el login está habilitado pero no está autenticado, redirigir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PrivateRoute;