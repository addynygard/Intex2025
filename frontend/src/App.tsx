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
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import UserAccountPage from './pages/UserAccountPage';
import MovieCollection from './pages/MovieCollection';
import ShowCollection from './pages/ShowCollection';
import { UserContext } from './context/UserContext';

function App() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  // Grabs the user's role from the backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('https://intex2025-group3-5-2nd-backend-ehfjgfbkgpddatfk.eastus-01.azurewebsites.net/api/movie/role', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRole(data.role || '');
        setEmail(data.email || '');
        setUserId(data.userId || null); // only if your backend sends this
      } else {
        setRole('');
        setEmail('');
        setUserId(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{
      userId: userId ?? 0,
      email: email,
      role: role,
      setUser: (user) => {
        setUserId(user.userId ? parseInt(user.userId) : null);
        setEmail(user.email ?? '');
        setRole(user.role);
      }
    }}>
      <Router>
        <ConditionalHeader role={role} />
        <Routes>
          <Route path="/" element={<HomePage language={''} />} />
          <Route path="/CreateAccount" element={<CreateAccountPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Movie" element={<MoviePage />} />
          <Route path="/MovieDetail" element={<MovieDetailPage />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicyPage />} />
          <Route path="/account" element={<UserAccountPage />} />
          <Route path="/MovieCollection" element={<MovieCollection />} />
          <Route path="/ShowCollection" element={<ShowCollection />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
        <Footer />
      </Router>
    </UserContext.Provider>
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

  return (
    <Header
      role={role}
      language={''}
      toggleLanguage={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
}

export default App;
