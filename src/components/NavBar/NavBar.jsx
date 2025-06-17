import React, { useContext } from "react";
import "./_navbar.scss";
import { NavLink, useNavigate} from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";
import placeholderAvatar from "../../assets/images/placeholder_Avatar.jpg";

const NavBar = () => {

  const {avatar, logout, userId, token} = useContext(UserContext)
  const navigate = useNavigate();

  // Handler for Home button
  const handleHomeClick = () => {
    if (userId) {
      navigate(`/landingPageUser/${userId}/${token}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="bg-primary">
        <div className={"navRealm"}>
           <button className="navHomeBtn" onClick={handleHomeClick}>
            Home
          </button>
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
        <img src={avatar || placeholderAvatar} />{" "}
          {/* JB: Placeholder for BE-User-Pic */}
          <div className={"dropdown"}>
        <ul>
        <img src={avatar || placeholderAvatar} />
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
