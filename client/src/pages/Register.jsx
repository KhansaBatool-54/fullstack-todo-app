import { useState } from "react";
import "./Login.css"; // reusing the same styles
import Logo from "../components/Logo";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Register({ onSwitchToLogin }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.register(name, email, password);
      await login(email, password); // auto-login after successful registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Logo />
        <h1>Create Account</h1>
        <p>Sign up to start managing your tasks.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span className="switch-link" onClick={onSwitchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;