import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section className="page page-auth">
      <div className="panel auth-panel">
        <div className="panel__header panel__header--stacked">
          <div className="eyebrow">Start journaling</div>
          <h1>Create an account</h1>
          <p className="page-lead">
            Set up your private space for mood tracking and reflection.
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="journal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              type="password"
            />
          </label>

          <button type="submit" className="button button-primary">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
