// frontend/src/components/ApiKeyManagement.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('/api/v1/api-keys');
      setApiKeys(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load API keys');
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      const response = await axios.post('/api/v1/api-keys', {
        name: newKeyName
      });
      setApiKeys([...apiKeys, response.data]);
      setOpen(false);
      setNewKeyName('');
    } catch (err) {
      setError('Failed to create API key');
    }
  };

  const handleRevokeKey = async (keyId) => {
    try {
      await axios.delete(`/api/v1/api-keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    } catch (err) {
      setError('Failed to revoke API key');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">API Keys</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Create New Key
        </Button>
      </Box>

      <List>
        {apiKeys.map((key) => (
          <ListItem
            key={key.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleRevokeKey(key.id)}
                aria-label="revoke"
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={key.name}
              secondary={`Created: ${new Date(key.created_at).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Key Name"
            fullWidth
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateKey} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApiKeyManagement;