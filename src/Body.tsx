import { Outlet, useNavigate } from 'react-router-dom';
import { Footer, Navbar } from './Components';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAppStore } from './Store';

const Body = () => {
  const navigate = useNavigate();
  const loggedInUser = useAppStore((state) => state.user);

  useEffect(() => {
    const authPages = new Set(['/login', '/signup']);

    if (loggedInUser && authPages.has(location.pathname)) {
      navigate('/', { replace: true });
      return;
    }
    if (!loggedInUser && !authPages.has(location.pathname))
      navigate('/login', { replace: true });
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
