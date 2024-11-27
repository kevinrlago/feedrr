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
  Campaign as ChannelIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import axios from 'axios';

const TelegramConfig = () => {
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [bots, setBots] = useState([]);
  const [openDialog, setOpenDialog] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    chatId: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, channelsRes, botsRes] = await Promise.all([
          axios.get('http://localhost:8000/telegram/groups'),
          axios.get('http://localhost:8000/telegram/channels'),
          axios.get('http://localhost:8000/telegram/bots')
        ]);
        setGroups(groupsRes.data);
        setChannels(channelsRes.data);
        setBots(botsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      const endpoint = `http://localhost:8000/telegram/${openDialog}`;
      await axios.post(endpoint, formData);
      // Refresh data after adding
      const response = await axios.get(endpoint);
      switch(openDialog) {
        case 'groups': setGroups(response.data); break;
        case 'channels': setChannels(response.data); break;
        case 'bots': setBots(response.data); break;
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog('');
    setFormData({ name: '', chatId: '', description: '' });
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
              Chat ID: {item.chatId || 'N/A'}
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
          onClick={() => setOpenDialog('channels')}
        >
          Add Channel
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

      <Typography variant="h5" gutterBottom>Channels</Typography>
      <Grid container spacing={3} mb={4}>
        {renderCards(channels, <ChannelIcon color="primary" />)}
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
            label="Chat ID"
            fullWidth
            value={formData.chatId}
            onChange={(e) => setFormData({...formData, chatId: e.target.value})}
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

export default TelegramConfig;