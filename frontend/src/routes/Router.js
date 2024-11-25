// frontend/src/routes/Router.js
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Settings from '../components/Settings';
import LoginMethodsConfig from '../components/AdminSettings/LoginMethodsConfig';

export const routes = [
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
    children: [
      { path: "profile", element: <ProfileSettings /> },
      { path: "general", element: <GeneralSettings /> },
      { 
        path: "login-methods", 
        element: <AdminRoute><LoginMethodsConfig /></AdminRoute> 
      }
    ]
  }
];