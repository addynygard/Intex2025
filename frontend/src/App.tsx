import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CreateAccountPage from './pages/CreateAccountPage';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import Footer from './components/Footer';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import UserAccountPage from './pages/UserAccountPage';

function App() {
  const [role, setRole] = useState<string | null>(null);

  // Grabs the user's role from the backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/movie/user/role', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRole(data.role); // Set the user's role (e.g., 'admin' or 'user')
        } else {
          setRole(null); // Clear the role if the request fails
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <Router>
      <ConditionalHeader role={role} /> {/* Conditionally render the Header */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/CreateAccount" element={<CreateAccountPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Movie" element={<MoviePage />} />
        <Route path="/MovieDetail" element={<MovieDetailPage />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/account" element={<UserAccountPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

// Conditional Header Component
function ConditionalHeader({ role }: { role: string | null }) {
  const location = useLocation();

  // Don't render the Header on the HomePage or Privacy Policy if not logged in
  if (
    location.pathname === '/' ||
    (location.pathname === '/PrivacyPolicy' && !role)
  ) {
    return null;
  }

  return <Header role={role} />;
}

export default App;
