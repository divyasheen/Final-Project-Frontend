import React, { createContext, useState, useEffect } from "react";

// JB: Create a context
export const UserContext = createContext();

// JB: Create a provider for the userId context
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    // JB: search for the userId inside the localStorage
    return localStorage.getItem("userId") || null;
  });

  // JB: If the browser finds a userId it will store it in the localStorage ... everytime when the userId changes (dependecy of the useEffect)
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  const [avatar, setAvatar] = useState();

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
    <UserContext.Provider value={{ userId, setUserId, avatar, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
};
