import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, refreshToken } from '../../utility/authService';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        // Verify token is still valid
        await refreshToken();
        setIsAuth(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return isAuth ? children : null;
};

export default ProtectedRoute;