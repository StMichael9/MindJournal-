import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Smile,
  Tag,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/reflections", label: "Reflections", icon: BookOpen },
  { to: "/mood_logs", label: "Mood Logs", icon: Smile },
  { to: "/tags", label: "Tags", icon: Tag },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const items = user ? NAV_ITEMS : [];

  return (
    <>
      <button
        type="button"
        className="sidebar__toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="sidebar-nav"
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`sidebar-backdrop ${menuOpen ? "sidebar-backdrop--open" : ""}`}
        onClick={closeMenu}
      />

      <aside
        className={`sidebar ${menuOpen ? "sidebar--open" : ""} ${desktopCollapsed ? "sidebar--collapsed" : ""}`}
        id="sidebar-nav"
        aria-label="Primary navigation"
      >
        <div className="sidebar__header">
          <Link to="/" className="brand sidebar__brand" onClick={closeMenu}>
            <span className="sidebar__brand-full">MindJournal</span>
            <span className="sidebar__brand-short" aria-hidden="true"></span>
          </Link>

          <button
            type="button"
            className="sidebar__collapse"
            aria-label={
              desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            onClick={() => setDesktopCollapsed((current) => !current)}
          >
            {desktopCollapsed ? (
              <ChevronRight size={18} strokeWidth={2.25} />
            ) : (
              <ChevronLeft size={18} strokeWidth={2.25} />
            )}
          </button>
        </div>

        {!desktopCollapsed && (
          <p className="sidebar__subtitle">
            A calm space for daily reflection.
          </p>
        )}

        <nav className="sidebar__nav">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
              }
              onClick={closeMenu}
              title={desktopCollapsed ? label : undefined}
            >
              <Icon size={19} strokeWidth={2} className="sidebar__link-icon" />
              <span className="sidebar__link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {user ? (
            <>
              <div
                className="user-chip sidebar__user"
                title={desktopCollapsed ? user.email : undefined}
              >
                <User
                  size={16}
                  strokeWidth={2}
                  className="sidebar__user-icon"
                />
                <span className="sidebar__user-label">{user.email}</span>
              </div>
              <button
                type="button"
                className="button button-ghost sidebar__button"
                onClick={handleLogout}
                title={desktopCollapsed ? "Logout" : undefined}
              >
                <LogOut size={17} strokeWidth={2} />
                <span className="sidebar__button-label">Logout</span>
              </button>
            </>
          ) : (
            <div className="sidebar__guest-actions">
              <Link to="/login" className="sidebar__link" onClick={closeMenu}>
                Login
              </Link>
              <Link
                to="/signup"
                className="button button-primary sidebar__button"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
