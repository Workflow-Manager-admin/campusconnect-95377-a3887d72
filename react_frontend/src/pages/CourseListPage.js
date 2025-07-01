import React, { useState, useEffect } from "react";
import { fetchCoursesForUser } from "../supabaseClient";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function CourseListPage() {
  const { user } = React.useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      // Replace with Supabase fetch logic
      const data = await fetchCoursesForUser(user, query);
      setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, [user, query]);

  return (
    <div className="page page-courses">
      <h2>Courses</h2>
      <input
        className="course-search"
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <div>Loading courses...</div>
      ) : (
        <ul className="courses-list">
          {courses.map((course) => (
            <li key={course.id}>
              <Link to={`/courses/${course.id}`}>
                <div className="course-code">{course.code}</div>
                <div className="course-title">{course.title}</div>
                <div className="course-faculty">{course.faculty_name || "Unassigned"}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseListPage;
