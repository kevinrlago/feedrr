// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { userService } from './services/user.service';
import { api } from './services/api'; // Add this line to import the api module
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  RssFeed as RssIcon,
  Add as AddIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore,
  Assessment as StatsIcon,
  Warning as AlertIcon
} from '@mui/icons-material';

// Icons
import TelegramIcon from './components/common/icons/TelegramIcon/index';
import DiscordIcon from './components/common/icons/DiscordIcon/index';
import WhatsAppIcon from './components/common/icons/WhatsAppIcon/index';

// Features - Dashboard
import Dashboard from './components/dashboard/Dashboard/index';
import Stats from './components/dashboard/Stats/index';
import Alerts from './components/dashboard/Alerts/index';

// Features - Feeds
import FeedList from './components/features/feeds/FeedList/index';
import AddFeed from './components/features/feeds/AddFeed/index';
import FeedRequests from './components/features/feeds/FeedRequests/index';

// Features - Categories
import CategoryConfig from './components/features/categories/CategoryConfig/index';

// Features - Users
import UserList from './components/features/users/UserList/index';
import AddUser from './components/features/users/AddUser/index';
import UserProfile from './components/features/users/UserProfile/index';

// Features - Notifications
import NotificationList from './components/features/notifications/NotificationList/index';

// Features - Auth
import Login from './components/features/auth/Login/index';
import MagicLinkLogin from './components/features/auth/MagicLinkLogin/index';

// Features - Settings
import TelegramConfig from './components/features/settings/TelegramConfig/index';
import DiscordConfig from './components/features/settings/DiscordConfig/index';
import WhatsAppConfig from './components/features/settings/WhatsAppConfig/index';
import LoginMethodsConfig from './components/features/settings/LoginMethodsConfig/index';
import LoginConfig from './components/features/settings/LoginConfig';

// Layout
import Sidebar from './components/layout/Sidebar/index';

// Initial Setup
import InitialSetup from './components/features/setup/InitialSetup';

// Common
import Logo from './components/common/Logo/index';

const drawerWidth = 240;

const SidebarWrapper = styled('div')(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    paddingTop: 64, // Cambiado de marginTop a paddingTop
    height: '100vh',
    position: 'fixed',
    overflowY: 'auto'
  },
}));

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: '100%',
  transition: theme.transitions.create(['margin', 'padding'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const AppWrapper = styled('div')({
  display: 'flex',
  minHeight: '100vh',
});

const menuItems = [
  { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
  {
    text: 'Feeds',
    icon: <RssIcon />,
    children: [
      { path: '/feeds', icon: <RssIcon />, text: 'Feed List' },
      { path: '/feeds/add', icon: <AddIcon />, text: 'Add Feed' }
    ]
  },
  {
    text: 'Configuration',
    icon: <SettingsIcon />,
    children: [
      {
        text: 'Senders',
        icon: <SendIcon />,
        children: [
          { path: '/configuration/senders/telegram', text: 'Telegram' },
          { path: '/configuration/senders/discord', text: 'Discord' },
          { path: '/configuration/senders/whatsapp', text: 'WhatsApp' }
        ]
      },
      { path: '/configuration/users', icon: <PersonIcon />, text: 'Users' }
    ]
  }
];

const InitialRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);
  
  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        // Primero verificar si existe configuración
        const { data: loginConfig } = await api.get('/api/v1/config/login');
        setHasConfig(true);

        // Luego verificar si existen usuarios
        const { exists } = await userService.checkUsersExist();
        setHasUsers(exists);
      } catch (err) {
        console.error('Error checking initial setup:', err);
        setHasConfig(false);
      } finally {
        setLoading(false);
      }
    };
    checkInitialSetup();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  // Si no hay configuración, ir al setup inicial
  if (!hasConfig) {
    return <Navigate to="/setup" replace />;
  }

  // Si hay configuración pero no hay usuarios, ir al setup inicial
  if (!hasUsers) {
    return <Navigate to="/setup" replace />;
  }

  // Si hay configuración y usuarios, ir al login
  return <Navigate to="/login" replace />;
};

const App = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFeeds, setOpenFeeds] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openSenders, setOpenSenders] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleClick = (item) => {
    if (item.text === 'Feeds') setOpenFeeds(!openFeeds);
    if (item.text === 'Configuration') setOpenConfig(!openConfig);
    if (item.text === 'Senders') setOpenSenders(!openSenders);
  };

  const renderMenuItem = (item, depth = 0) => (
    <React.Fragment key={item.text}>
      <ListItem
        button
        onClick={() => {
          handleClick(item);
          if (item.path) handleNavigate(item.path);
        }}
        component={item.path ? Link : 'div'}
        to={item.path}
        sx={{ pl: 2 * (depth + 1) }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
        {item.children && (
          item.text === 'Feeds' ? (openFeeds ? <ExpandLess /> : <ExpandMore />) :
          item.text === 'Configuration' ? (openConfig ? <ExpandLess /> : <ExpandMore />) :
          item.text === 'Senders' ? (openSenders ? <ExpandLess /> : <ExpandMore />) :
          null
        )}
      </ListItem>
      {item.children && (
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
            {item.children.map(subItem => renderMenuItem(subItem, depth + 1))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  return (
    <AppWrapper>
      {isAuthenticated && (
        <>
          <AppBar position="fixed">
            <Toolbar>
              <Logo variant="full" />
            </Toolbar>
          </AppBar>

          <SidebarWrapper>
            <Sidebar>
              <List>
                {menuItems.map(item => renderMenuItem(item))}
              </List>
            </Sidebar>
          </SidebarWrapper>
        </>
      )}

      <Main sx={{ 
        pl: isAuthenticated ? `${drawerWidth}px` : 0,
        pt: isAuthenticated ? '64px' : 0 
      }}>
        <Routes>
          <Route path="/setup" element={<InitialSetup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<InitialRedirect />} />
          {/* ... rest of routes ... */}
        </Routes>
      </Main>
    </AppWrapper>
  );
};

export default App;