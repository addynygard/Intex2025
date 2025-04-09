import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // adjust path if needed

function Header({ role }: { role: string | null }) {
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <h1 className="text-lg font-bold tracking-wide">CinaNiche</h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6 items-center">
          {/* Home link to ShowPage.tsx */}
          <Link
            to="/Movie"
            className="text-white hover:text-gray-300 transition"
          >
            Home
          </Link>

          {/* Movies link to MovieCollection.tsx */}
          <Link
            to="/MovieCollection"
            className="text-white hover:text-gray-300 transition"
          >
            Movies
          </Link>

          {/* Account link */}
          <Link
            to="/account"
            className="text-white hover:text-gray-300 transition"
          >
            Account
          </Link>

          {/* Admin Link - Only show if role is admin */}
          {role === 'admin' && (
            <Link
              to="/adminpage"
              className="text-white hover:text-gray-300 transition"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Search Bar on the right */}
        <div className="ml-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
