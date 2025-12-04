import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuth, user } = useAuth();
  
  console.log('PrivateRoute check:', { isAuth, user, roles }); // DEBUG
  
  if (!isAuth) {
    console.log('Not authenticated, redirecting to login'); // DEBUG
    return <Navigate to="/login" replace />;
  }
  
  if (roles.length && !roles.includes(user?.role)) {
    console.log('Role not authorized:', user?.role); // DEBUG
    return <Navigate to="/login" replace />;
  }
  
  return children;
};