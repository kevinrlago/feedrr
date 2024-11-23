// src/App.js
// 1. Third-party imports
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { ThemeProvider, styled } from '@mui/material/styles';
import axios from 'axios';
import { orange } from '@mui/material/colors';

// 2. Material-UI icons
import {
  Dashboard as DashboardIcon,
  Menu,
  ExpandLess,
  ExpandMore,
  RssFeed as RssIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Notifications,
  Settings as SettingsIcon,
  BarChart as StatsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';

// 3. Custom icons
import TelegramIcon from './components/icons/TelegramIcon';
import DiscordIcon from './components/icons/DiscordIcon';
import WhatsAppIcon from './components/icons/WhatsAppIcon';

// 4. Components
import DashboardComponent from './components/Dashboard';
import FeedList from './components/FeedList';
import AddFeed from './components/AddFeed';
import CategoryConfig from './components/CategoryConfig';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import TelegramConfig from './components/TelegramConfig';
import DiscordConfig from './components/DiscordConfig';
import WhatsAppConfig from './components/WhatsAppConfig';
import Alerts from './components/Alerts';
import Stats from './components/Stats';
import Logo from './components/Logo';
import FeedRequests from './components/FeedRequests';

// 5. Icon aliases
const NotificationsIcon = Notifications;
const AlertIcon = Notifications;

const drawerWidth = 240;

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidth,
}));

const App = () => {
  const [openFeeds, setOpenFeeds] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openSenders, setOpenSenders] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEnabled, setLoginEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginConfig = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/config');
        setLoginEnabled(response.data.enabled);
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Error checking login config:', error);
      }
    };
    
    checkLoginConfig();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    {
      text: 'Feeds',
      icon: <RssIcon />,
      subItems: [
        { text: 'List Feeds', icon: <RssIcon />, path: '/feeds' },
        { text: 'Add Feed', icon: <AddIcon />, path: '/feeds/add' },
        { text: 'Feed Requests', icon: <ListAltIcon />, path: '/feeds/requests' }
      ]
    },
    { text: 'Categorias', icon: <CategoryIcon />, path: '/categories' },
    {
      text: 'Configuration',
      icon: <SettingsIcon />,
      subItems: [
        {
          text: 'Senders',
          icon: <SendIcon />,
          subItems: [
            { text: 'Telegram', icon: <TelegramIcon />, path: '/senders/telegram' },
            { text: 'Discord', icon: <DiscordIcon />, path: '/senders/discord' },
            { text: 'WhatsApp', icon: <WhatsAppIcon />, path: '/senders/whatsapp' }
          ]
        },
        { text: 'Users', icon: <PersonIcon />, path: '/users' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
        
      ]
    },
    { text: 'Alerts', icon: <AlertIcon />, path: '/alerts' },
    { text: 'Statistics', icon: <StatsIcon />, path: '/stats' }
  ];

  const handleClick = (item) => {
    if (item.text === 'Feeds') setOpenFeeds(!openFeeds);
    if (item.text === 'Configuration') setOpenConfig(!openConfig);
    if (item.text === 'Senders') setOpenSenders(!openSenders);
  };

  const renderMenuItem = (item, depth = 0) => (
    <React.Fragment key={item.text}>
      <ListItem
        button
        onClick={() => item.subItems && handleClick(item)}
        component={item.path ? Link : 'div'}
        to={item.path}
        sx={{ pl: 2 * (depth + 1) }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
        {item.subItems && (
          item.text === 'Feeds' ? (openFeeds ? <ExpandLess /> : <ExpandMore />) :
          item.text === 'Configuration' ? (openConfig ? <ExpandLess /> : <ExpandMore />) :
          item.text === 'Senders' ? (openSenders ? <ExpandLess /> : <ExpandMore />) :
          null
        )}
      </ListItem>
      {item.subItems && (
        <Collapse
          in={
            item.text === 'Feeds' ? openFeeds :
            item.text === 'Configuration' ? openConfig :
            item.text === 'Senders' ? openSenders :
            false
          }
          timeout="auto"
          unmountOnExit // Changed from unmountOnClose
        >
          <List component="div" disablePadding>
            {item.subItems.map(subItem => renderMenuItem(subItem, depth + 1))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Orange Header with white icon only */}
      <Box
        sx={{
          width: '100%',
          bgcolor: orange[500],
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Logo color="white" variant="icon-only" />
      </Box>

      <Box sx={{ display: 'flex', mt: '64px' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              mt: '64px',
              height: `calc(100% - 64px)`,
              display: 'flex',
              flexDirection: 'column'
            },
          }}
        >
          <List sx={{ flex: 1 }}>
            {menuItems.map(item => renderMenuItem(item))}
          </List>

          {/* Auth Icon */}
          {loginEnabled && (
            <ListItem
              button
              onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
            >
              <ListItemIcon>
                {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText primary={isLoggedIn ? "Logout" : "Login"} />
            </ListItem>
          )}

          {/* Footer Logo */}
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              p: 2
            }}
          >
            <Logo />
          </Box>
        </Drawer>

        <Main>
          <Routes>
            <Route path="/" element={<DashboardComponent />} />
            <Route path="/feeds" element={<FeedList />} />
            <Route path="/feeds/add" element={<AddFeed />} />
            <Route path="/feeds/requests" element={<FeedRequests />} />
            <Route path="/categories" element={<CategoryConfig />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/telegram" element={<TelegramConfig />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/senders/telegram" element={<TelegramConfig />} />
            <Route path="/senders/discord" element={<DiscordConfig />} />
            <Route path="/senders/whatsapp" element={<WhatsAppConfig />} />
          </Routes>
        </Main>
      </Box>
    </Box>
  );
};

export default App;