// src/components/WhatsAppConfig.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Person as ContactIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import axios from 'axios';

const WhatsAppConfig = () => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bots, setBots] = useState([]);
  const [openDialog, setOpenDialog] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, contactsRes, botsRes] = await Promise.all([
          axios.get('http://localhost:8000/whatsapp/groups'),
          axios.get('http://localhost:8000/whatsapp/contacts'),
          axios.get('http://localhost:8000/whatsapp/bots')
        ]);
        setGroups(groupsRes.data || []);
        setContacts(contactsRes.data || []);
        setBots(botsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      const endpoint = `http://localhost:8000/whatsapp/${openDialog}`;
      await axios.post(endpoint, formData);
      const response = await axios.get(endpoint);
      switch(openDialog) {
        case 'groups': setGroups(response.data); break;
        case 'contacts': setContacts(response.data); break;
        case 'bots': setBots(response.data); break;
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog('');
    setFormData({ name: '', phoneNumber: '', description: '' });
  };

  const renderCards = (items = [], icon) => {
    if (!Array.isArray(items)) {
      console.error('Expected array for items, got:', typeof items);
      return null;
    }

    return items.map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item.id || Math.random()}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              {icon}
              <Typography variant="h6" ml={1}>
                {item.name || 'Unnamed'}
              </Typography>
            </Box>
            <Typography color="textSecondary">
              Phone: {item.phoneNumber || 'N/A'}
            </Typography>
            <Typography variant="body2">
              {item.description || 'No description'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" gap={2} mb={4}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('groups')}
        >
          Add Group
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('contacts')}
        >
          Add Contact
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('bots')}
        >
          Add Bot
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>Groups</Typography>
      <Grid container spacing={3} mb={4}>
        {renderCards(groups, <GroupIcon color="primary" />)}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Contacts</Typography>
      <Grid container spacing={3} mb={4}>
        {renderCards(contacts, <ContactIcon color="primary" />)}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Bots</Typography>
      <Grid container spacing={3}>
        {renderCards(bots, <BotIcon color="primary" />)}
      </Grid>

      <Dialog open={!!openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Add New {openDialog?.charAt(0).toUpperCase() + openDialog?.slice(1, -1)}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhatsAppConfig;