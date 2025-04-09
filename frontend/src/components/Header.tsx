import { Link } from 'react-router-dom';
import { Home, Film, User, Shield, LogOut } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Logo from '../assets/cinenichelogo.png'; 


function Header({ role }: { role: string | null }) {
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
          <span>Home</span>
        </Link>
        <Link to="/MovieCollection" className="hover:text-gray-300">
          <Film size={18} strokeWidth={1.5} />
          <span>Movies</span>
        </Link>
        <Link to="/account" className="hover:text-gray-300">
          <User size={18} strokeWidth={1.5} />
          <span>Account</span>
        </Link>
        <Link to="/logout" className="hover:text-gray-300">
          <LogOut size={16} strokeWidth={1.5} />
          <span>Logout</span>
        </Link>
        {role === 'admin' && (
          <Link to="/adminpage" className="hover:text-gray-300">
            <Shield size={18} strokeWidth={1.5} />
            <span>Admin</span>
          </Link>
        )}
      </nav>
    </div>

    {/* Search */}
    <div className="header-search">
      <SearchBar />
    </div>
  </div>
</header>

  );
}

export default Header;
