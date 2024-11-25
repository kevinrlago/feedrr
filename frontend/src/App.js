// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import PrivateRoute from './components/routes/PrivateRoute';
import Login from './components/features/auth/Login';
import { useAuth } from './hooks/useAuth';
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled
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
import MagicLinkLogin from './components/features/auth/MagicLinkLogin/index';

// Features - Settings
import TelegramConfig from './components/features/settings/TelegramConfig/index';
import DiscordConfig from './components/features/settings/DiscordConfig/index';
import WhatsAppConfig from './components/features/settings/WhatsAppConfig/index';
import LoginMethodsConfig from './components/features/settings/LoginMethodsConfig/index';
import LoginConfig from './components/features/settings/LoginConfig';

// Layout
import Sidebar from './components/layout/Sidebar/index';

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
  paddingTop: `calc(64px + ${theme.spacing(3)})`, // Ajustado el padding superior
  marginLeft: drawerWidth,
  minHeight: '100vh',
}));

const AppWrapper = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  paddingTop: 64, // Añadido padding superior
});

const App = () => {
  const navigate = useNavigate();
  const [openFeeds, setOpenFeeds] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openSenders, setOpenSenders] = useState(false);
  const { loginEnabled } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleClick = (item) => {
    if (item.text === 'Feeds') setOpenFeeds(!openFeeds);
    if (item.text === 'Configuration') setOpenConfig(!openConfig);
    if (item.text === 'Senders') setOpenSenders(!openSenders);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Feeds', icon: <RssIcon />, path: '/feeds', subItems: [
      { text: 'All Feeds', icon: <RssIcon />, path: '/feeds' },
      { text: 'Add Feed', icon: <AddIcon />, path: '/feeds/add' },
      { text: 'Requests', icon: <ListAltIcon />, path: '/feeds/requests' }
    ]},
    {
      text: 'Configuration',
      icon: <SettingsIcon />,
      subItems: [
        {
          text: 'Users',
          icon: <PersonIcon />,
          subItems: [
            { 
              text: 'User List', 
              icon: <ListAltIcon />, 
              path: '/configuration/users/list'  // Updated path
            },
            { 
              text: 'Add User', 
              icon: <AddIcon />, 
              path: '/configuration/users/add' 
            }
          ]
        },
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

  const Settings = () => {
    return <div>Settings Page</div>;
  };

  return (
    <AppWrapper>
      <AppBar position="fixed">
        <Toolbar>
          <Logo variant="full" />
          {/* Rest of toolbar content */}
        </Toolbar>
      </AppBar>
      <SidebarWrapper>
        <Sidebar>
          <List>
            {menuItems.map(item => renderMenuItem(item))}
          </List>
        </Sidebar>
      </SidebarWrapper>
      <Main>
        <Routes>
          {loginEnabled ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/feeds" element={
                <PrivateRoute>
                  <FeedList />
                </PrivateRoute>
              } />
              <Route path="/feeds/add" element={
                <PrivateRoute>
                  <AddFeed />
                </PrivateRoute>
              } />
              <Route path="/feeds/requests" element={
                <PrivateRoute>
                  <FeedRequests />
                </PrivateRoute>
              } />
              <Route path="/categories" element={
                <PrivateRoute>
                  <CategoryConfig />
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              } />
              <Route path="/users/add" element={
                <PrivateRoute>
                  <AddUser />
                </PrivateRoute>
              } />
              <Route path="/telegram" element={
                <PrivateRoute>
                  <TelegramConfig />
                </PrivateRoute>
              } />
              <Route path="/alerts" element={
                <PrivateRoute>
                  <Alerts />
                </PrivateRoute>
              } />
              <Route path="/stats" element={
                <PrivateRoute>
                  <Stats />
                </PrivateRoute>
              } />
              <Route path="/senders/telegram" element={
                <PrivateRoute>
                  <TelegramConfig />
                </PrivateRoute>
              } />
              <Route path="/senders/discord" element={
                <PrivateRoute>
                  <DiscordConfig />
                </PrivateRoute>
              } />
              <Route path="/senders/whatsapp" element={
                <PrivateRoute>
                  <WhatsAppConfig />
                </PrivateRoute>
              } />
              <Route path="/notifications" element={
                <PrivateRoute>
                  <NotificationList />
                </PrivateRoute>
              } />
              <Route path="/auth/magic-link" element={
                <PrivateRoute>
                  <MagicLinkLogin />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }>
                <Route path="profile" element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                } />
                <Route path="login-methods" element={
                  <PrivateRoute>
                    <LoginMethodsConfig />
                  </PrivateRoute>
                } />
              </Route>
              <Route path="/settings/login-methods" element={
                <PrivateRoute>
                  <LoginMethodsConfig />
                </PrivateRoute>
              } />
              <Route path="/configuration/login" element={
                <PrivateRoute>
                  <LoginConfig />
                </PrivateRoute>
              } />
              <Route 
                path="/configuration/users/list" 
                element={
                  <PrivateRoute>
                    <UserList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/configuration/users/add" 
                element={
                  <PrivateRoute>
                    <AddUser />
                  </PrivateRoute>
                } 
              />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
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
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="/auth/magic-link" element={<MagicLinkLogin />} />
              <Route path="/settings" element={<Settings />}>
                <Route path="profile" element={<UserProfile />} />
                <Route path="login-methods" element={<LoginMethodsConfig />} />
              </Route>
              <Route path="/settings/login-methods" element={<LoginMethodsConfig />} />
              <Route path="/configuration/login" element={<LoginConfig />} />
            </>
          )}
        </Routes>
      </Main>
    </AppWrapper>
  );
};

export default App;