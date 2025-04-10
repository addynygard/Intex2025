import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// To allow users to access their account page based on their user_id, you need to dynamically fetch
// the logged-in user's data using their user_id. Typically, the user_id is stored in a secure location,
// such as a JWT (JSON Web Token) or local storage, after the user logs in.

function AccountPage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        navigate('/Login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user data from the API response
        } else {
          console.error('Failed to fetch user data');
          navigate('/Login'); // Redirect to login if the request fails
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/Login'); // Redirect to login on error
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">No Image</span>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-1">
              Name:
            </h3>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800">
              {user.name}
            </div>
          </div>

          <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </h3>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800">
              {user.email}
            </div>
          </div>

          <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-1">
              Phone:
            </h3>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800">
              {user.phone}
            </div>
          </div>
        </div>
        <br />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
