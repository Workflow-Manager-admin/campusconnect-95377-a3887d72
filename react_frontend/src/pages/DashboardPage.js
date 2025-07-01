import React from "react";
import { AuthContext } from "../App";

function DashboardPage() {
  const { user } = React.useContext(AuthContext);
  return (
    <div className="page page-dashboard">
      <h2>
        Welcome, {user && user.name}!{" "}
        <span role="img" aria-label="Party">
          🎉
        </span>
      </h2>
      <p>
        {user?.role === "student" &&
          "Check out your enrolled courses or browse open classes."}
        {user?.role === "faculty" &&
          "Manage your teaching assignments and schedules."}
        {user?.role === "admin" &&
          "You have admin access. Go to the admin panel to manage courses or users."}
      </p>
    </div>
  );
}
export default DashboardPage;
