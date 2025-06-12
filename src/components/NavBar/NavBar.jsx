import React, { useContext } from "react";
import "./_navbar.scss";
import { NavLink} from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";

const NavBar = () => {

  const {avatar, logout, userId} = useContext(UserContext)

  return (
    <>
      <nav style={{}}>
        <div className={"navRealm"}>
          {[
            "university",
            //"bugadune",
            //"csscrypta",
            "forumia",
            "playground",
            //"towerofapion",
            "Chatbot",
          ].map((path) => (
            <NavLink key={path} to={`/${path}`}>
              {path[0].toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </div>

        <div className={"profilPic"}>
          <img src={avatar} alt="" />{" "}
          {/* JB: Placeholder for BE-User-Pic */}
          <div className={"dropdown"}>
        <ul>
          <img src={avatar} alt="" />
          <p>UserName</p>
          <li>
            <NavLink to={`/profile/${userId}`}>Profil</NavLink>
          </li>
          <li>
            <NavLink to={"/edit-profile"}>Edit</NavLink>
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
