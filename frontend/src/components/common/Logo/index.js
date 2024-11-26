// src/components/Logo.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { RssFeed } from '@mui/icons-material';
import { orange } from '@mui/material/colors';
import PropTypes from 'prop-types';

const Logo = ({ color = orange[500], variant = 'full' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: color
    }}
  >
    <RssFeed sx={{ fontSize: 24 }} />
    {variant === 'full' && (
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          letterSpacing: 1
        }}
      >
        Feedrr
      </Typography>
    )}
  </Box>
);
Logo.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(['full', 'icon'])
};
export default Logo;