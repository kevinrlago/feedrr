// frontend/src/components/Navigation/SettingsMenu.js
import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const SettingsMenu = ({ anchorEl, open, onClose }) => {
  const { user } = useAuth();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => onClose('/settings/profile')}>
        <ListItemIcon><PersonIcon /></ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      {user?.role === 'ADMIN' && (
        <MenuItem onClick={() => onClose('/settings/login-methods')}>
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText>Login Methods</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};

export default SettingsMenu;