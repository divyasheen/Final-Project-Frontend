import React from "react";
import "./_navbar.scss";

import { NavLink, Outlet } from "react-router-dom";
const NavBar = () => {
  return (
    <>
      <nav style={{}}>
        <div className={"navRealm"}>
          {[
            "university",
            "bugadune",
            "csscrypta",

            "forumia",
            "playground",
            "towerofapion",
          ].map((path) => (
            <NavLink key={path} to={`/${path}`}>
              {path[0].toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </div>
        <div className={"profilPic"}>
          <div className={"dropdown"} >
          <img src="https://placekeanu.com/50/50/" alt="" /> {/* JB: Placeholder for BE-User-Pic */}
            <ul>
              <li>
                <NavLink>Profil</NavLink>
              </li>
              <li>
                <NavLink>Edit</NavLink>
              </li>
              <li>
                <NavLink>Logout</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
