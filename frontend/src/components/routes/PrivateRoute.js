// src/components/routes/PrivateRoute.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loginEnabled, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login if not authenticated and login is enabled
  if (loginEnabled && !isAuthenticated && location.pathname !== '/login') {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />;
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PrivateRoute;