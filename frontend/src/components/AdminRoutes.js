// frontend/src/components/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/settings" replace />;
  }

  return children;
};

export default AdminRoute;