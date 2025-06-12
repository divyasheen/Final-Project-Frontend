import React, { createContext, useState, useEffect } from "react";

// JB: Create a context
export const UserContext = createContext();

// JB: Create a provider for the userId context
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userProgress, setUserProgress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState();

  const fetchAvatar = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}/getProfilPic`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch avatar");
      }

      const data = await response.json();
      setAvatar(data.image_url);
      
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  useEffect(() => {
    fetchAvatar()
  }, [])
  
  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []); 
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("An unexpected error");
  // JB: If the browser finds a userId it will store it in the localStorage ... everytime when the userId changes (dependecy of the useEffect)
  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (avatar) {
      localStorage.setItem("avatar", avatar);
    }
  }, [userId, token, avatar]);

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



// fetching the posts from the backend

  // const fetchingData = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/posts");

  //     if (!res.ok) {
  //       setMessage("Something went wrong fetching posts");
  //       return; // stop here if response not OK
  //     }

  //     const data = await res.json();

  //     setPosts(data);

  //     // update state here
  //     setMessage(null); // clear any previous messages on success
  //   } catch (error) {
  //     console.log(error);
  //     console.log(message);
  //     setMessage(error?.message || "Unexpected error occurred");
  //   }
  // };
  const fetchingData = async (limit , offset ) => {
    try {
      const res = await fetch(`http://localhost:5000/posts?limit=${limit}&offset=${offset}`);
  
      if (!res.ok) {
        setMessage("Something went wrong fetching posts");
        return;
      }
  
      const data = await res.json();
      console.log("Fetched posts:", data);

      // Append new posts to existing ones
      if (offset === 0) {
        setPosts(data); // First load or refresh
      } else {
        setPosts(prev => [...prev, ...data]); // Load more
      }
  
      setMessage(null);
    } catch (error) {
      console.log(error);
      setMessage(error?.message || message);
    }
  };
  
  return (
    <UserContext.Provider
      value={{
       fetchingData,posts,setPosts, userId,
        setUserId,
        token,
        setToken,
        user,
        setUser,
        logout,
        avatar,
        setAvatar,
        userProgress,
        setUserProgress,
        userData,
        setUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
