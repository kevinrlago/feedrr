// frontend/src/components/Navigation/Navbar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    setAnchorEl(null);
    if (path) {
      navigate(path);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Other navbar items */}
        
        <IconButton 
          color="inherit" 
          onClick={handleSettingsClick}
          aria-label="settings"
        >
          <SettingsIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          <MenuItem onClick={() => handleClose('/settings/profile')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleClose('/settings/login-methods')}>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText>Login Methods</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;