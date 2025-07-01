import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Topbar({ onMenuClick, theme, onThemeToggle, user, primary, accent }) {
  return (
    <header
      className="topbar"
      style={{
        background: "#fff",
        borderBottom: `2px solid ${accent}`,
        color: primary,
      }}
    >
      <button className="topbar-menubtn" onClick={onMenuClick} aria-label="Open sidebar">
        ☰
      </button>
      <span className="app-title" style={{ color: primary }}>
        CampusConnect
      </span>
      <div className="topbar-actions">
        {user && (
          <Link className="topbar-icon" to="/notifications" title="Notifications">
            <span role="img" aria-label="Notifications">
              🔔
            </span>
          </Link>
        )}
        <button className="topbar-icon" onClick={onThemeToggle} title="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user && (
          <Link className="topbar-avatar" to="/profile">
            <span>{user.name[0]?.toUpperCase()}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Topbar;
