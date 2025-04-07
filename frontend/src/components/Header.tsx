import { Link } from 'react-router-dom';

// The role has been passed from the App.tsx file to the Header component
// The role is used to conditionally render the admin panel link
// The role is either 'admin' or 'user'
function Header({ role }: { role: string | null }) {
  return (
    <header className="bg-gray-800 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo or Title */}
        <h1 className="text-lg font-bold tracking-wide">CinaNiche</h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/Movie"
            className="text-white hover:text-gray-300 transition"
          >
            Show Page
          </Link>

          <br />
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
