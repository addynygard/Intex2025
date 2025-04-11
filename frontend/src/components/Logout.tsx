import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Logout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Correct function here

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await fetch('https://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }

    // ✅ Clear user context
    setUser({
      userId: null,
      email: null,
      role: [],
    });

    // ✅ Redirect to login
    navigate('/login');
  };

  return (
    <button className="logout" onClick={handleLogout}>
      {children}
    </button>
  );
}

export default Logout;
