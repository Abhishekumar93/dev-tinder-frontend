import { Navigate, Outlet } from 'react-router-dom';
import { useIsUserAuthenticated } from '../Hooks';

export const ProtectedRoute = () => {
  const loggedInUser = useIsUserAuthenticated();

  return loggedInUser ? <Outlet /> : <Navigate to="/login" replace />;
};
