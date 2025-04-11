import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      {/* get rid of "className="card" in the next line if don't like big card around whole thing */}
      <div className="card"> 
        <h1 className="text-center">Log In</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button type="button" className="btn btn-primary" onClick={() => navigate('/Movie')}>Log In</button>

          <p className="text-center">
            Don't have an account? <a onClick={() => navigate('/CreateAccount')}>Create one here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
