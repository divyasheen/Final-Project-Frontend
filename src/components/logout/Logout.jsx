import { useNavigate } from 'react-router-dom';
import { clearUserSession } from '../../utility/authService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch('http://localhost:5000/users/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearUserSession();
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;