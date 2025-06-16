import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
