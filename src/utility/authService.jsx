const API_URL = 'http://localhost:5000';

// Store user session
export const storeUserSession = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Handle login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    
    // Add validation for response structure
    if (!data.token || !data.user) {
      throw new Error('Invalid response structure from server');
    }
    
    // Store session with the token and user info
    storeUserSession(data.token, { 
      id: data.user.id, 
      email: data.user.email,
      username: data.user.username || data.user.email.split('@')[0]
    });
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Handle Google login
export const handleGoogleLogin = async (credential) => {
  const response = await fetch(`${API_URL}/users/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Google login failed');
  }

  const data = await response.json();
  if (!data.user || !data.token) {
    throw new Error('Invalid response from server');
  }
  
  // Store session with the token and basic user info
  storeUserSession(data.token, { 
    id: data.user.id, 
    email: data.user.email,
    username: data.user.username || data.user.email.split('@')[0] // Fallback
  });
  
  return data;
};

// Refresh token
export const refreshToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) {
    clearUserSession();
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();
  storeUserSession(data.token, getCurrentUser());
  return data.token;
};

// Fetch with auth
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: "include"
    });

    // If token expired, try to refresh it
    if (response.status === 401) {
      const newToken = await refreshToken();
      headers.Authorization = `Bearer ${newToken}`;
      return await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: "include"
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};