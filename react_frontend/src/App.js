import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout & Styling
import "./App.css";
import "./index.css";

// Pages & Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import SchedulePage from "./pages/SchedulePage";
import DashboardPage from "./pages/DashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { getCurrentUser, logoutUser } from "./supabaseClient";

// Context for Auth
export const AuthContext = createContext();

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Light theme colors for primary, secondary, accent
  const appColors = {
    primary: "#1a237e",
    secondary: "#1976d2",
    accent: "#ffb300",
  };

  // Effect: theme switching
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: fetch current user from Supabase on mount
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // Simple Protected Route
  function ProtectedRoute({ children, roles }) {
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      <Router>
        <div className={`app-root theme-${theme}`}>
          <Sidebar
            open={sidebarOpen}
            onClose={closeSidebar}
            user={user}
            accent={appColors.accent}
            primary={appColors.primary}
          />
          <div className="main-panel">
            <Topbar
              onMenuClick={openSidebar}
              theme={theme}
              onThemeToggle={toggleTheme}
              user={user}
              primary={appColors.primary}
              accent={appColors.accent}
            />
            <main className="content-container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <LoginPage />}
                />
                <Route
                  path="/register"
                  element={user ? <Navigate to="/" /> : <RegisterPage />}
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CourseListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseId"
                  element={
                    <ProtectedRoute>
                      <CourseDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute roles={["student", "faculty"]}>
                      <SchedulePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminPanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
