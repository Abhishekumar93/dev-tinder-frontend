import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

const Body = () => {
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
