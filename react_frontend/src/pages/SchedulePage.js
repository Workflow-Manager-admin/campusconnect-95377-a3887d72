import React, { useEffect, useState } from "react";
import { fetchScheduleForUser } from "../supabaseClient";
import { AuthContext } from "../App";

/**
 * Course schedule for student/faculty.
 */
function SchedulePage() {
  const { user } = React.useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      const data = await fetchScheduleForUser(user);
      setSchedule(data);
      setLoading(false);
    }
    loadSchedule();
  }, [user]);

  return (
    <div className="page page-schedule">
      <h2>Schedule</h2>
      {loading ? (
        <div>Loading schedule...</div>
      ) : (
        <ul className="schedule-list">
          {schedule.length === 0 ? (
            <li>No courses found.</li>
          ) : (
            schedule.map((item) => (
              <li key={item.id}>
                <span className="course-code">{item.code}</span>: {item.title}
                <div className="schedule-faculty">{item.faculty_name}</div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
export default SchedulePage;
