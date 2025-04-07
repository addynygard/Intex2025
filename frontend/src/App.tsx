import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CreateAccountPage from './pages/CreateAccountPage';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/CreateAccount" element={<CreateAccountPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Movie" element={<MoviePage />} />
          <Route path="/MovieDetail" element={<MovieDetailPage />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicyPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
