// frontend/src/components/FeedFilters.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  Grid
} from '@mui/material';
import axios from 'axios';

const FeedFilters = ({ feedId }) => {
  const [whitelist, setWhitelist] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [listType, setListType] = useState('whitelist');

  const handleAddWord = async () => {
    if (!newWord.trim()) return;
    
    try {
      await axios.post(`/api/feeds/${feedId}/${listType}`, {
        words: [newWord]
      });
      
      if (listType === 'whitelist') {
        setWhitelist([...whitelist, newWord]);
      } else {
        setBlacklist([...blacklist, newWord]);
      }
      
      setNewWord('');
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Word Filters</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            label="Add new word"
            size="small"
          />
          <Button
            onClick={() => setListType('whitelist')}
            variant={listType === 'whitelist' ? 'contained' : 'outlined'}
            sx={{ ml: 1 }}
          >
            Whitelist
          </Button>
          <Button
            onClick={() => setListType('blacklist')}
            variant={listType === 'blacklist' ? 'contained' : 'outlined'}
            sx={{ ml: 1 }}
          >
            Blacklist
          </Button>
          <Button
            onClick={handleAddWord}
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            Add
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Whitelist</Typography>
          <Box sx={{ mt: 1 }}>
            {whitelist.map((word) => (
              <Chip
                key={word}
                label={word}
                onDelete={() => {/* handle delete */}}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Blacklist</Typography>
          <Box sx={{ mt: 1 }}>
            {blacklist.map((word) => (
              <Chip
                key={word}
                label={word}
                onDelete={() => {/* handle delete */}}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedFilters;