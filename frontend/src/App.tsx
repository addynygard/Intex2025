import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { UserContext } from './context/UserContext';
import Cookies from 'js-cookie';
import CookieConsent from 'react-cookie-consent';

// Pages
import HomePage from './pages/HomePage';
import CreateAccountPage from './pages/CreateAccountPage';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminPage from './pages/AdminPage';
import UserAccountPage from './pages/UserAccountPage';
import MovieCollection from './pages/MovieCollection';
import ShowCollection from './pages/ShowCollection';

// Components
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AuthorizeView from './components/AuthorizeView';

function App() {
  const [user, setUser] = useState<{ userId: string | null, email: string | null, role: string | null }>({
    userId: null,
    email: null,
    role: null
  });

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      <Router>
        <AppRoutes role={user.role} />
      </Router>
    </UserContext.Provider>
  );
}

function AppRoutes({ role }: { role: string | null }) {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ['/', '/login', '/createaccount', '/privacypolicy'];
    const currentPath = location.pathname.toLowerCase();
    const isPublic = publicPaths.includes(currentPath);

    const timer = setTimeout(() => {
      if (!role && !isPublic) {
        console.warn("🔁 No role found. Redirecting to /login");
        navigate('/login');
      } else {
        setIsReady(true);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [role, location.pathname, navigate]);

  useEffect(() => {
    const consent = Cookies.get('userConsent');
    if (consent === 'true') {
      initializeAnalytics();
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('userConsent', 'true', { expires: 365 });
    initializeAnalytics();
  };

  const handleDeclineCookies = () => {
    Cookies.set('userConsent', 'false', { expires: 365 });
    console.log('🚫 User declined cookies.');
  };

  const initializeAnalytics = () => {
    // Load analytics or tracking scripts here (conditionally)
    console.log('✅ Analytics Initialized (user consent given)');
  };

  const publicPaths = ['/', '/login', '/createaccount', '/privacypolicy'];
  const isPublic = publicPaths.includes(location.pathname.toLowerCase());

  if (!isReady || (!role && !isPublic)) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ConditionalHeader role={role} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/CreateAccount" element={<CreateAccountPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicyPage />} />

        {/* Auth-Protected Routes */}
        <Route path="/Movie" element={<AuthorizeView><MoviePage /></AuthorizeView>} />
        <Route path="/MovieDetail" element={<AuthorizeView><MovieDetailPage /></AuthorizeView>} />
        <Route path="/account" element={<AuthorizeView><UserAccountPage /></AuthorizeView>} />
        <Route path="/MovieCollection" element={<AuthorizeView><MovieCollection /></AuthorizeView>} />
        <Route path="/ShowCollection" element={<AuthorizeView><ShowCollection /></AuthorizeView>} />
        <Route path="/movie/:id" element={<AuthorizeView><MovieDetailPage /></AuthorizeView>} />

        {/* Admin Only */}
        <Route path="/adminpage" element={
          <ProtectedRoute userRole={role} allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
      <CookieConsent
        location="bottom"
        buttonText="I Understand"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="userConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#fff", background: "#4CAF50", fontSize: "13px" }}
        declineButtonStyle={{ color: "#fff", background: "#f44336", fontSize: "13px" }}
        expires={365}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
      >
        This website uses cookies to enhance the user experience. You can accept or decline.
      </CookieConsent>
    </>
  );
}

function ConditionalHeader({ role }: { role: string | null }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (path === '/' || (path === '/privacypolicy' && !role)) {
    return null;
  }

  return <Header role={role} />;
}

export default App;
