import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "./Components";

const Body = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
