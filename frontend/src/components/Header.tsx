import { Link } from 'react-router-dom';

import { Home, Film, User, Shield, LogOut } from 'lucide-react';

import SearchBar from '../components/SearchBar';

import Logo from '../assets/cinenichelogo.png';

import Logout from './Logout';

import { AuthorizedUser } from './AuthorizeView';

function Header({
  role,

  language,

  toggleLanguage,
}: {
  role: string | null;

  language: string;

  toggleLanguage: () => void;
}) {
  return (
    <header>
      <div className="header-inner">
        {/* Logo + Nav */}

        <div className="flex items-center">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="CineNiche Logo" className="logo-image" />
          </Link>

          <nav className="nav-links">
            <Link to="/Movie" className="hover:text-gray-300">
              <Home size={18} strokeWidth={1.5} />

              <span>{language === 'en' ? 'Home' : 'Inicio'}</span>
            </Link>

            <Link to="/MovieCollection" className="hover:text-gray-300">
              <Film size={18} strokeWidth={1.5} />

              <span>{language === 'en' ? 'Movies' : 'Películas'}</span>
            </Link>

            <Link to="/account" className="hover:text-gray-300">
              <User size={18} strokeWidth={1.5} />
              <span>{language === 'en' ? 'Account' : 'Cuenta'}</span>
              {/* <span>Account</span> */}
            </Link>
            {/* <Link to="/logout" className="hover:text-gray-300">
              <LogOut size={16} strokeWidth={1.5} />
              <span>Logout</span>
            </Link> */}
            {role === 'admin' && (
              <Link to="/adminpage" className="hover:text-gray-300">
                <Shield size={18} strokeWidth={1.5} />
                <span>Admin</span>
              </Link>
            )}
            <Logout>
              <div className="hover:text-red-400 flex items-center space-x-1 cursor-pointer">
                <LogOut size={16} strokeWidth={1.5} />

                <span>{language === 'en' ? 'Logout' : 'Cerrar sesión'}</span>
              </div>
            </Logout>
          </nav>
        </div>

        {/* Search bar and language toggle */}

        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-400">
            {language === 'en' ? 'Language: English' : 'Idioma: Español'}
          </div>

          <button
            onClick={toggleLanguage}
            className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition"
          >
            {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
          </button>

          <div className="header-search w-60">
            <SearchBar />
          </div>
        </div>

        {/* Optional user identity display */}

        <div className="text-sm text-right pr-4 mt-1 text-gray-400">
          Logged in as: <AuthorizedUser value="email" />
        </div>
      </div>
    </header>
  );
}

export default Header;
