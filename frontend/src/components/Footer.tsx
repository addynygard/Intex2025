import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© 2025 CinaNiche. All rights reserved.</p>
        <p>
          <Link to="/PrivacyPolicy" className="text-blue-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
