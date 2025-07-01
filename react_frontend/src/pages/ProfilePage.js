import React from "react";
import { AuthContext } from "../App";

/**
 * Simple profile (name, email, role)
 */
function ProfilePage() {
  const { user } = React.useContext(AuthContext);
  if (!user) return null;
  return (
    <div className="page page-profile">
      <h2>Profile</h2>
      <div>
        <b>Name:</b> {user.name}
      </div>
      <div>
        <b>Email:</b> {user.email}
      </div>
      <div>
        <b>Role:</b> {user.role}
      </div>
    </div>
  );
}
export default ProfilePage;
