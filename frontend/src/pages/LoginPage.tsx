import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/movieAPI'; // or authAPI if you split it

import React, { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log('✅ Login successful:', response);

      // 👑 If the user is an Admin, redirect to Admin page
      const roles = response.roles || [];
      if (roles.includes('Admin')) {
        navigate('/AdminPage');
      } else {
        navigate('/Movie');
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
