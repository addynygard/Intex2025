import { useNavigate } from 'react-router-dom';
import { createAccount, loginUser } from '../api/movieAPI';
import React, { useState } from 'react';

function CreateAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(email, password);
      // Optional: auto-login and redirect
      await loginUser(email, password);
      navigate('/Movie');
    } catch (error: any) {
      alert(error.message || 'Something went wrong creating the account');
    }
  };

  return (
    <div className="main-container">
      <div className="card">
        <h1 className="text-center">Create Account</h1>
        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>

          <p className="text-center">
            Already have an account?{' '}
            <a onClick={() => navigate('/Login')}>Log in here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
