import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationRead } from "../supabaseClient";
import { AuthContext } from "../App";

/**
 * User notifications list.
 */
function NotificationsPage() {
  const { user } = React.useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    async function load() {
      setNotifications(await fetchNotifications(user));
    }
    load();
  }, [user]);

  async function handleMarkRead(id) {
    await markNotificationRead(id);
    setNotifications(await fetchNotifications(user));
  }

  return (
    <div className="page page-notifications">
      <h2>Notifications</h2>
      <ul className="notify-list">
        {notifications.length === 0 && <li>No notifications.</li>}
        {notifications.map((n) => (
          <li key={n.id} className={n.read ? "notify-read" : "notify-unread"}>
            <span>{n.message}</span>
            <span className="notify-date">{new Date(n.created_at).toLocaleString()}</span>
            {!n.read && (
              <button className="btn-accent" onClick={() => handleMarkRead(n.id)}>
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;
