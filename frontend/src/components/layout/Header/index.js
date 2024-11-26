// frontend/src/components/Layout/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import SettingsMenu from '../Navigation/SettingsMenu';
import Logo from '../common/Logo';

const HeaderComponent = () => {
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <div style={{ flexGrow: 1 }} />
        <IconButton 
          color="inherit"
          onClick={(e) => setSettingsAnchor(e.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>

        <SettingsMenu 
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={() => setSettingsAnchor(null)}
        />
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;