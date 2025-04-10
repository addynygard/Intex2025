import { Link } from 'react-router-dom';
import { Home, Film, User, Shield, LogOut } from 'lucide-react';
import SearchBar from './SearchBar'; // Adjust if it's not in components/
import Logo from '../assets/cinenichelogo.png';
import Logout from './Logout';
import { AuthorizedUser } from './AuthorizeView'; // Optional

function Header({ role }: { role: string | null }) {
  return (
    <header>
      <div className="header-inner flex justify-between items-center px-4 py-3 bg-gray-900 text-white shadow-md">
        {/* Logo + Nav */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="CineNiche Logo" className="logo-image w-10 h-10" />
          </Link>

          <nav className="flex space-x-6 items-center text-sm">
            <Link to="/Movie" className="hover:text-gray-300 flex items-center space-x-1">
              <Home size={18} strokeWidth={1.5} />
              <span>Home</span>
            </Link>

            <Link to="/MovieCollection" className="hover:text-gray-300 flex items-center space-x-1">
              <Film size={18} strokeWidth={1.5} />
              <span>Movies</span>
            </Link>

            <Link to="/account" className="hover:text-gray-300 flex items-center space-x-1">
              <User size={18} strokeWidth={1.5} />
              <span>Account</span>
            </Link>

            {role === 'admin' && (
              <Link to="/adminpage" className="hover:text-gray-300 flex items-center space-x-1">
                <Shield size={18} strokeWidth={1.5} />
                <span>Admin</span>
              </Link>
            )}

            {/* Real logout functionality via component */}
            <Logout>
              <div className="hover:text-red-400 flex items-center space-x-1 cursor-pointer">
                <LogOut size={16} strokeWidth={1.5} />
                <span>Logout</span>
              </div>
            </Logout>
          </nav>
        </div>

        {/* Search bar */}
        <div className="header-search w-60">
          <SearchBar />
        </div>
      </div>

      {/* Optional user identity display */}
      <div className="text-sm text-right pr-4 mt-1 text-gray-400">
        Logged in as: <AuthorizedUser value="email" />
      </div>
    </header>
  );
}

export default Header;
