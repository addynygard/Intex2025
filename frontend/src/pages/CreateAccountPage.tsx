import { useNavigate } from "react-router-dom";

function CreateAccountPage() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="card">
        <h1 className="text-center">Create Account</h1>
        <form>
          {/* <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div> */}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button type="submit" className="btn btn-primary">Create Account</button>

          <p className="text-center">
            Already have an account? <a onClick={() => navigate('/Login')}>Log in here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
