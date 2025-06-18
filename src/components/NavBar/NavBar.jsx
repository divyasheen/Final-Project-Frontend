import React, { useContext, useState } from "react";
import "./_navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";
import placeholderAvatar from "../../assets/images/placeholder_Avatar.jpg";
import { motion } from "framer-motion";

const NavBar = () => {
  const { avatar, logout, userId, token, userData } = useContext(UserContext);
  const navigate = useNavigate();

  // Handler for Home button
  const handleHomeClick = () => {
    if (userId) {
      navigate(`/landingPageUser/${userId}/${token}`);
    } else {
      navigate("/");
    }
  };

  // console.log(userData);

  // JB: Motion variables
  const list = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="custom-navbar">
        <button className="navHomeBtn" onClick={handleHomeClick}>
          Home
        </button>
        <div className={"navRealm"}>
          {[
            "university",
            "forumia",
            "playground",
            "Chatbot",
            //"bugadune",
            //"csscrypta",
            //"towerofapion",
          ].map((path) => (
            <NavLink key={path} to={`/${path}`}>
              {path[0].toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </div>

        <div className="profilPic">
          <img
            onClick={() => setIsOpen(!isOpen)}
            src={avatar || placeholderAvatar}
          />{" "}
          <div className="dropdown">
            <motion.ul
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={list}
              style={{ overflow: "hidden" }}
            >
              <motion.li variants={item} className="imgLi">
                <img className="profilPic" src={avatar || placeholderAvatar} />
              </motion.li>

              <motion.li
                variants={item}
                className="hoverLi"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate(`/profile/${userId}`);
                }}
              >
                <NavLink to={`/profile/${userId}`}>Profil</NavLink>
              </motion.li>

              <motion.li
                variants={item}
                className="hoverLi"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate(`/edit-profile`);
                }}
              >
                <NavLink to={"/edit-profile"}>Edit</NavLink>
              </motion.li>

              <motion.li
                variants={item}
                className="hoverLi"
                onClick={() => {
                  setIsOpen(!isOpen);
                  logout();
                }}
              >
                <a onClick={logout}>Logout</a>
              </motion.li>
            </motion.ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
