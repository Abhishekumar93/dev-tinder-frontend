import { Navigate, Outlet } from 'react-router-dom';
import { useIsUserAuthenticated } from '../Hooks';

export const PublicRoute = () => {
  const loggedInUser = useIsUserAuthenticated();

  return loggedInUser ? <Navigate to="/" replace /> : <Outlet />;
};
