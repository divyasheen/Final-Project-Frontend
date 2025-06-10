import React, { createContext, useState, useEffect } from "react";

// JB: Create a context
export const UserContext = createContext();

// JB: Create a provider for the userId context
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    // JB: search for the userId inside the localStorage
    return localStorage.getItem("userId") || null;
  });

  const [userProgress, setUserProgress] = useState();
  const [userData, setUserData] = useState();
  const [avatar, setAvatar] = useState();

  // JB: If the browser finds a userId it will store it in the localStorage ... everytime when the userId changes (dependecy of the useEffect)
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/progress`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    fetchUserProgress();
    fetchUserData();
    fetchAvatar();
  },[userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId, avatar, setAvatar, userData, setUserData, userProgress, setUserProgress }}>
      {children}
    </UserContext.Provider>
  );
};
