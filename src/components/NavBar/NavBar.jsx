import React from "react";
import { NavLink, Outlet } from "react-router-dom";
const NavBar = () => {
  return (
    <>
      <nav style={{ padding: 10, background: "#eee" }}>
        {[
          "university",
          "bugadune",
          "csscrypta",
          "forumia",
          "playground",
          "towerofapion",
        ].map((path) => (
          <NavLink key={path} to={`/${path}`} style={{ margin: "0 8px" }}>
            {path[0].toUpperCase() + path.slice(1) }
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
