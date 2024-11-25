// frontend/src/components/Layout/Header.js
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import SettingsMenu from '../Navigation/SettingsMenu';
import { styled } from '@mui/system';

const Header = styled('header')(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const HeaderComponent = () => {
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  return (
    <Header>
      <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)}>
        <SettingsIcon />
      </IconButton>

      <SettingsMenu 
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
      />
    </Header>
  );
};

export default HeaderComponent;