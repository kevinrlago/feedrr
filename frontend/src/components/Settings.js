// frontend/src/components/Settings.js
import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LoginMethodsConfig from './AdminSettings/LoginMethodsConfig';

const Settings = () => {
  const { user } = useAuth();
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="General" />
        {user?.role === 'ADMIN' && <Tab label="Login Methods" />}
      </Tabs>

      {tab === 0 && (
        <Box sx={{ p: 3 }}>
          {/* General settings content */}
        </Box>
      )}

      {tab === 1 && user?.role === 'ADMIN' && (
        <Box sx={{ p: 3 }}>
          <LoginMethodsConfig />
        </Box>
      )}
    </Box>
  );
};

export default Settings;