import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RssFeed as FeedIcon,
  Category as CategoryIcon,
  Settings as ConfigIcon,
  Send as SendersIcon,
  Person as UserIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Language as LanguageIcon,
  Security as LoginIcon,
  FilterList as FilterIcon,
  ExpandLess,
  ExpandMore,
  ListAlt as ListAltIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    feeds: false,
    categories: false,
    configuration: false,
    senders: false,
    users: false
  });

  const handleClick = (section) => {
    setOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuItems = [
    { path: '/', icon: <DashboardIcon />, text: 'Dashboard' },
    {
      text: 'Feeds',
      icon: <FeedIcon />,
      children: [
        { path: '/feeds', icon: <FeedIcon />, text: 'Feed List' },
        { path: '/feeds/add', icon: <AddIcon />, text: 'Add Feed' },
        { path: '/feeds/requests', icon: <FeedIcon />, text: 'Feed Requests' }
      ]
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      children: [
        { path: '/categories/add', icon: <AddIcon />, text: 'Add Category' }
      ]
    },
    {
      text: 'Configuration',
      icon: <ConfigIcon />,
      children: [
        {
          text: 'Senders',
          icon: <SendersIcon />,
          children: [
            { path: '/configuration/senders/telegram', text: 'Telegram' },
            { path: '/configuration/senders/discord', text: 'Discord' },
            { path: '/configuration/senders/whatsapp', text: 'WhatsApp' }
          ]
        },
        {
          text: 'Feeds',
          icon: <FeedIcon />,
          children: [
            { path: '/configuration/feeds/filters', icon: <FilterIcon />, text: 'Filters' },
            { path: '/configuration/feeds/language', icon: <LanguageIcon />, text: 'Language Filters' }
          ]
        },
        { path: '/configuration/login', icon: <LoginIcon />, text: 'Login' },
        {
          text: 'Users',
          icon: <UserIcon />,
          children: [
            { text: 'User List', icon: <ListAltIcon />, path: '/configuration/users/list'},
            { path: '/configuration/users/add', icon: <AddIcon />, text: 'Add User' },
            { path: '/configuration/users/roles', text: 'User Roles' },
            { path: '/configuration/users/roles/add', text: 'Add User Roles' }
          ]
        }
      ]
    },
    { path: '/alerts', icon: <AlertIcon />, text: 'Alerts' }
  ];

  const renderMenuItem = (item, depth = 0) => (
    <React.Fragment key={item.text}>
      <ListItem
        button
        onClick={() => {
          if (item.children) {
            handleClick(item.text.toLowerCase());
          }
          if (item.path) {
            navigate(item.path);
          }
        }}
        sx={{ pl: 2 * depth }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
        {item.children && (
          open[item.text.toLowerCase()] ? <ExpandLess /> : <ExpandMore />
        )}
      </ListItem>
      {item.children && (
        <Collapse in={open[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map(child => renderMenuItem(child, depth + 1))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Box>
  );
};

export default Sidebar;