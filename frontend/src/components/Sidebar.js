import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Collapse } from '@mui/material';
import { Home, Add, Category, Settings, ExpandLess, ExpandMore, BarChart, Warning, People } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

const Sidebar = () => {
  const [openFeeds, setOpenFeeds] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);

  const handleFeedsClick = () => {
    setOpenFeeds(!openFeeds);
  };

  const handleConfigClick = () => {
    setOpenConfig(!openConfig);
  };

  const handleUsersClick = () => {
    setOpenUsers(!openUsers);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Feeds" />
        </ListItem>
        <ListItem button onClick={handleFeedsClick}>
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Feeds" />
          {openFeeds ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openFeeds} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/add-feed" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Agregar Feed" />
            </ListItem>
            <ListItem button component={Link} to="/categories" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Category />
              </ListItemIcon>
              <ListItemText primary="Categorías" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleConfigClick}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
          {openConfig ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openConfig} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/config/login" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/config/telegram" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Telegram" />
            </ListItem>
            <ListItem button component={Link} to="/config/users" sx={{ pl: 4 }}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleUsersClick}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/users" sx={{ pl: 4 }}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Gestión de Usuarios" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/stats">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Estadísticas" />
        </ListItem>
        <ListItem button component={Link} to="/alerts">
          <ListItemIcon>
            <Warning />
          </ListItemIcon>
          <ListItemText primary="Alertas" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;