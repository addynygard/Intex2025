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
import { UserProvider } from './context/UserContext'; // ✅ Use your updated UserProvider
import CookieConsent from './components/CookieConsent';
import Cookies from 'js-cookie';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const [language, setLanguage] = useState<string>('en'); // Default language

  useEffect(() => {
    const cookieLang = Cookies.get('language');
    setLanguage(cookieLang === 'es' ? 'es' : 'en');
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    Cookies.set('language', newLang, { expires: 365 });
  };

  return (
    <UserProvider>
      <Router>
        <ConditionalHeader
          language={language}
          toggleLanguage={toggleLanguage}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/CreateAccount" element={<CreateAccountPage />} />
          <Route path="/Login" element={<LoginPage />} />

          {/* User Routes */}
          <Route
            path="/Movie"
            element={
              <PrivateRoute>
                <MoviePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/MovieDetail"
            element={
              <PrivateRoute>
                <MovieDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrivacyPolicy"
            element={
              <PrivateRoute>
                <PrivacyPolicyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <UserAccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/MovieCollection"
            element={
              <PrivateRoute>
                <MovieCollection />
              </PrivateRoute>
            }
          />
          <Route
            path="/ShowCollection"
            element={
              <PrivateRoute>
                <ShowCollection />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <PrivateRoute>
                <MovieDetailPage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/adminpage"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
      <CookieConsent />
    </UserProvider>
  );
}

function ConditionalHeader({
  language,
  toggleLanguage,
}: {
  language: string;
  toggleLanguage: () => void;
}) {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <Header
      role={''} // You can remove this if Header no longer needs it
      language={language}
      toggleLanguage={toggleLanguage}
    />
  );
}

export default App;
