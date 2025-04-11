import { useNavigate } from 'react-router-dom';
import { API_URL, loginUser } from '../api/movieAPI'; // or authAPI if you split it
import { useUser } from '../context/UserContext';
import React, { useEffect, useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userId, role, setUser } = useUser();

  // useEffect(() => {
  //   if (userId && role) {
  //     if (role.includes('Admin')) {
  //       navigate('/AdminPage');
  //     } else {
  //       navigate('/Movie');
  //     }
  //   }
  // }, [userId, role, navigate]);

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);

      if (!response || !response.email || !response.roles) {
        throw new Error('Login failed: missing user data.');
      }

      console.log('✅ Login successful:', response);

      // 🔄 Reconfirm role with pingauth before updating context or navigating
      const ping = await fetch(`${API_URL}/pingauth`, {
        credentials: 'include',
      });

      if (ping.ok) {
        const data = await ping.json();
        console.log('🔄 Reconfirmed roles from /pingauth:', data.roles);

        setUser({
          userId: data.userId ?? null,
          email: data.email,
          role: data.roles,
        });

        if (Array.isArray(data.roles) && data.roles.includes('Admin')) {
          console.log('🔐 Admin detected. Navigating to AdminPage.');
          navigate('/AdminPage');
        } else {
          console.log('👤 Regular user detected. Navigating to Movie.');
          navigate('/Movie');
        }
      } else {
        alert('Login succeeded, but role check failed.');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="main-container">
      {/* get rid of "className="card" in the next line if don't like big card around whole thing */}
      <div className="card">
        <h1 className="text-center">Log In</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />{' '}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />{' '}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
          >
            Log In
          </button>

          <p className="text-center">
            Don't have an account?{' '}
            <a onClick={() => navigate('/CreateAccount')}>Create one here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
