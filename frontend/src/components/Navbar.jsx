import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="topbar">
      <div className="topbar__inner">
        <Link to="/" className="brand">
          MindJournal
        </Link>

        {user ? (
          <div className="topbar__actions">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/reflections" className="nav-link">
              Reflections
            </Link>
            <Link to="/mood_logs" className="nav-link">
              Mood Logs
            </Link>
            <Link to="/tags" className="nav-link">
              Tags
            </Link>
            <span className="user-chip">{user.email}</span>
            <button
              type="button"
              className="button button-ghost"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="topbar__actions">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="button button-primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
