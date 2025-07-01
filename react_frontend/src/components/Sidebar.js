import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Sidebar({ open, onClose, user, accent, primary }) {
  const location = useLocation();
  if (!user) return null;

  // Sidebar links
  const navLinks = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/courses", label: "Courses", icon: "📚" },
    { path: "/schedule", label: "Schedule", icon: "📅", roles: ["student", "faculty"] },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/admin", label: "Admin", icon: "🛠", roles: ["admin"] },
  ];

  return (
    <nav
      className={`sidebar${open ? " open" : ""}`}
      style={{
        background: primary,
        borderRight: `3px solid ${accent}`,
      }}
    >
      <button className="sb-close-btn" aria-label="Close sidebar" onClick={onClose}>
        ×
      </button>
      <div className="sb-user">
        <div className="sb-avatar">{user.name[0]?.toUpperCase()}</div>
        <div>
          <div className="sb-name">{user.name}</div>
          <div className="sb-role">{user.role}</div>
        </div>
      </div>
      <ul className="sb-nav-list">
        {navLinks.map(
          (link) =>
            (!link.roles || link.roles.includes(user.role)) && (
              <li key={link.label} className={location.pathname === link.path ? "active" : ""}>
                <Link to={link.path} onClick={onClose}>
                  <span className="sb-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            )
        )}
        <li>
          <SidebarLogoutButton />
        </li>
      </ul>
    </nav>
  );
}

// PUBLIC_INTERFACE
function SidebarLogoutButton() {
  const { logoutUser, setUser } = React.useContext(AuthContext);
  const handleLogout = async () => {
    await logoutUser(); // Supabase logout
    setUser(null);
    window.location.href = "/login";
  };
  return (
    <button className="sb-logout" onClick={handleLogout}>
      🚪 Logout
    </button>
  );
}

export default Sidebar;
