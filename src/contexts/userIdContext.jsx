import React, { createContext, useState, useEffect } from "react";

// JB: Create a context
export const UserContext = createContext();

// JB: Create a provider for the userId context

// JB: search for the userId inside the localStorage
//DMR: Added token as well
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

/*   const [userProgress, setUserProgress] = useState(); */
  const [userData, setUserData] = useState();
  const [avatar, setAvatar] = useState();

  // JB: If the browser finds a userId it will store it in the localStorage ... everytime when the userId changes (dependecy of the useEffect)
  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [userId, token, user]);
  
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }

      // Clear all auth data regardless of server response
      setUser(null);
      setUserId(null);
      setToken(null);
      localStorage.clear();
      
      // Redirect to home page
      window.location.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear local data even if server request fails
      setUser(null);
      setUserId(null);
      setToken(null);
      localStorage.clear();
      window.location.replace("/");
    }
  };

  const fetchAvatar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/getProfilPic`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile picture!");
      }

      const data = await res.json(); 
      const imageUrl = data.image_url;  

      // console.log(data);
      // console.log(imageUrl);
      
      setAvatar(imageUrl);

    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  },[userId]);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, token, setToken, user, setUser, logout, avatar, setAvatar}}
    >
      {children}
    </UserContext.Provider>
  );
};
