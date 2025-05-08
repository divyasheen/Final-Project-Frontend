import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";

function Layout() {
  return (
    <>
      <NavBar />

      <Outlet />

      <Footer />
    </>
  );
}

export default Layout;
