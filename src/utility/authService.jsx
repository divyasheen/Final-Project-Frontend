// src/utility/authService.js
const API_URL = 'http://localhost:5000';

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Basic token validation
  try {
    // Check if token is a valid JWT format (has three parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      localStorage.removeItem('token');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Token validation error:', error);
    localStorage.removeItem('token');
    return null;
  }
};

export const refreshToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.log('No valid token available for refresh');
      throw new Error('No valid token available');
    }

    console.log('Attempting to refresh token...');
    const response = await fetch(`${API_URL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || 'Token refresh failed');
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('No token received from refresh');
    }

    // Validate new token before storing
    const parts = data.token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format received');
    }

    // Store new token
    localStorage.setItem('token', data.token);
    console.log('Token refreshed successfully');
    return data.token;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear invalid token
    localStorage.removeItem('token');
    throw error;
  }
};