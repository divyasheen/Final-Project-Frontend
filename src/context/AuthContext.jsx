import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          credentials: 'include' // Important for cookie-based auth
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Unified function to handle API errors
  const handleApiError = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }
    return response.json();
  };

  // Register function - matches your backend
  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await handleApiError(response);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login function - matches your cookie-based auth
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Crucial for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await handleApiError(response);
      
      // Get full user data if needed
      const userResponse = await fetch(`http://localhost:5000/users/${data.id}`, {
        credentials: 'include'
      });
      
      const userData = await handleApiError(userResponse);
      setCurrentUser(userData);
      
      return { 
        success: true, 
        user: userData,
        message: "Login successful" 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Google login - matches your implementation
  const googleLogin = async (credential) => {
    try {
      const response = await fetch("http://localhost:5000/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });

      const data = await handleApiError(response);
      setCurrentUser(data.user);
      
      return { 
        success: true,
        user: data.user,
        message: "Google login successful" 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/users/logout", {
        method: "POST",
        credentials: 'include'
      });
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    // Add other functions like forgotPassword if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}