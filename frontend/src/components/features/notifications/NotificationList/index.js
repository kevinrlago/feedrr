// frontend/src/components/NotificationList.js
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/notifications');
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <ListItem key={notification.id}>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.timestamp).toLocaleString()}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(notification.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No notifications available" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default NotificationList;