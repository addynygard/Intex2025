import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // or '@/components/SearchBar' if using path alias

// The role has been passed from the App.tsx file to the Header component
function Header({ role }: { role: string | null }) {
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <h1 className="text-lg font-bold tracking-wide mr-6">CinaNiche</h1>

        {/* 🔍 Search Bar */}
        <div className="ml-auto flex items-center">
          <SearchBar />
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/Movie"
            className="text-white hover:text-gray-300 transition"
          >
            Show Page
          </Link>
          <Link
            to="/account"
            className="text-white hover:text-gray-300 transition"
          >
            Account
          </Link>
          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-white hover:text-gray-300 transition"
            >
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
