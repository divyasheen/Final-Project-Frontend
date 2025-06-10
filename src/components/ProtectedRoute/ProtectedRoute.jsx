// src/components/ProtectedRoute.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { refreshToken } from '../../utility/authService';
import { UserContext } from '../../contexts/userIdContext';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { token, userId, logout, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Get current values from localStorage as backup
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');

      

        // Check both context and localStorage
        if ((!token && !storedToken) || (!userId && !storedUserId)) {
          console.log('No auth data found, redirecting to login');
          navigate('/login');
          return;
        }

        // If context is empty but localStorage has data, update context
        if ((!token && storedToken) || (!userId && storedUserId)) {
          console.log('Updating context from localStorage');
          if (storedToken) setToken(storedToken);
          // Note: userId is managed by the context's useEffect
        }

        // Only try to refresh token if we have a token
        const currentToken = token || storedToken;
        if (currentToken) {
          try {
            // Check if token is about to expire (within 5 minutes)
            const tokenData = JSON.parse(atob(currentToken.split('.')[1]));
            const expiresAt = tokenData.exp * 1000; // Convert to milliseconds
            const fiveMinutes = 5 * 60 * 1000;
            
            if (Date.now() + fiveMinutes > expiresAt) {
              console.log('Token is about to expire, refreshing...');
              const newToken = await refreshToken();
              if (newToken) {
                console.log('Token refreshed successfully');
                setToken(newToken);
              } else {
                throw new Error('Token refresh failed');
              }
            } else {
              console.log('Token is still valid, no refresh needed');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // If refresh fails, try to continue with existing token
            // If that fails too, the next request will trigger a redirect to login
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Auth verification error:', err);
        logout();
        navigate('/login');
      }
    };

    verifyAuth();
  }, [token, userId, navigate, logout, setToken, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white text-xl font-vt323">Loading...</div>
      </div>
    );
  }

  // Final check before rendering
  const finalToken = token || localStorage.getItem('token');
  const finalUserId = userId || localStorage.getItem('userId');

  if (!finalToken || !finalUserId) {
    console.log('Final auth check failed:', { finalToken, finalUserId });
    return null;
  }

  return children;
};

export default ProtectedRoute;
