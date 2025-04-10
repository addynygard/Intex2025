import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Grab context updater

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch("https://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const text = await response.text();
      console.log("Raw response text:", text);
      let data: any;

      try {
        data = JSON.parse(text);
        console.log("Parsed data:", data);
      } catch {
        throw new Error("Unexpected server response.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      // ✅ Set user context
      setUser({
        userId: data.userId ?? null,
        email: data.email ?? null,
        role: data.role ?? null
      });

      // ✅ Navigate to movie page
      navigate("/movie");

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="main-container">
      <div className="card">
        <h1 className="text-center">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
            />
          </div>
          <button type="submit" className="btn btn-primary">Log In</button>
          {error && <p className="error text-danger mt-2">{error}</p>}
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a onClick={() => navigate('/CreateAccount')} style={{ cursor: 'pointer' }}>
              Create one here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
