import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from './Components';
import { Toaster } from 'sonner';

const Body = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
