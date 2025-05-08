import React from "react";
import "./_navbar.scss";
import Footer from "../Footer/Footer";

import { NavLink} from "react-router-dom";

const NavBar = () => {
  const logout = () => {
    // JB: clear token
    window.localStorage.clear();
    // JB: redirect to home
    window.location.replace("/");
  };

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
          <img src="https://placekeanu.com/50/50/" alt="" />{" "}
          {/* JB: Placeholder for BE-User-Pic */}
          <div className={"dropdown"}>
        <ul>
          <img src="https://placekeanu.com/50/50/" alt="" />
          <p>UserName</p>
          <li>
            <NavLink to={"/:user"}>Profil</NavLink>
          </li>
          <li>
            <NavLink to={"/:user/edit"}>Edit</NavLink>
          </li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
        </div>
        
      </nav>
    </>
  );
};

export default NavBar;
