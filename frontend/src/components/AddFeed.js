import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  Reddit as RedditIcon,
  Feed as RssIcon  // Changed from Rss to Feed
} from '@mui/icons-material';
import axios from 'axios';

const AddFeed = () => {
  const [openDialog, setOpenDialog] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    description: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/feeds/${openDialog}`, formData);
      setOpenDialog('');
      setFormData({ name: '', url: '', category: '', description: '' });
      setSnackbar({
        open: true,
        message: 'Feed added successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding feed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const feedTypes = [
    {
      type: 'youtube',
      title: 'YouTube',
      icon: <YouTubeIcon sx={{ fontSize: 60, color: '#FF0000' }} />,
      description: 'Add YouTube channel or playlist as feed',
      color: '#FF0000'
    },
    {
      type: 'reddit',
      title: 'Reddit',
      icon: <RedditIcon sx={{ fontSize: 60, color: '#FF4500' }} />,
      description: 'Add subreddit or user feed',
      color: '#FF4500'
    },
    {
      type: 'custom',
      title: 'Custom RSS',
      icon: <RssIcon sx={{ fontSize: 60, color: '#FFA500' }} />,
      description: 'Add any RSS/Atom feed',
      color: '#FFA500'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Feed
      </Typography>

      <Grid container spacing={3}>
        {feedTypes.map((feed) => (
          <Grid item xs={12} sm={6} md={4} key={feed.type}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.02)' },
                transition: 'transform 0.2s'
              }}
              onClick={() => setOpenDialog(feed.type)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {feed.icon}
                <Typography variant="h5" gutterBottom>
                  {feed.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feed.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={!!openDialog} 
        onClose={() => setOpenDialog('')}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add {openDialog === 'youtube' ? 'YouTube' : 
               openDialog === 'reddit' ? 'Reddit' : 'Custom'} Feed
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
            label={openDialog === 'youtube' ? 'Channel/Playlist URL' :
                   openDialog === 'reddit' ? 'Subreddit/User URL' :
                   'Feed URL'}
            fullWidth
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
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
          <Button onClick={() => setOpenDialog('')} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Feed'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFeed;