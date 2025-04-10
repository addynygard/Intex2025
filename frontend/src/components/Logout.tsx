import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Logout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // ✅ Clear user context
    setUser({
      userId: null,
      email: null,
      role: null
    });

    // ✅ Navigate to login
    navigate('/login');
  };

  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {children}
    </a>
  );
}

export default Logout;
