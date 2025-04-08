import { Link } from 'react-router-dom';

function Header({ role }: { role: string | null }) {
  return (
    <header className="bg-[#0c0c0c] text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <Link to="/Movie" className="branding text-3xl font-extrabold tracking-wide hover:text-purple-300 transition duration-200">
          🎬 CinaNiche
        </Link>

        {/* Navigation */}
        <nav className="flex gap-4 items-center">
          <Link to="/Movie" className="nav-btn">Movies</Link>
          <Link to="/ShowCollection" className="nav-btn">Shows</Link>
          <Link to="/account" className="nav-btn">My Account</Link>
          {role === 'admin' && (
            <Link to="/adminpage" className="nav-btn">Admin</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
