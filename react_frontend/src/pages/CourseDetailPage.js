import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import {
  fetchCourseDetail,
  enrollInCourse,
  dropCourse,
  assignFacultyToCourse,
} from "../supabaseClient";

/**
 * Show course details, allow enrollment (student), management (faculty), assignments (admin)
 */
function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = React.useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [msg, setMsg] = useState("");
  const [facultyField, setFacultyField] = useState("");

  useEffect(() => {
    async function loadCourse() {
      const { detail, status } = await fetchCourseDetail(courseId, user);
      setCourse(detail);
      setEnrollmentStatus(status);
    }
    loadCourse();
  }, [courseId, user]);

  // PUBLIC_INTERFACE
  async function handleEnroll() {
    const { error } = await enrollInCourse(courseId, user);
    setMsg(error ? error.message : "Enrolled successfully");
    setEnrollmentStatus("active");
  }
  async function handleDrop() {
    const { error } = await dropCourse(courseId, user);
    setMsg(error ? error.message : "Dropped successfully");
    setEnrollmentStatus("none");
  }
  async function handleAssignFaculty() {
    const { error } = await assignFacultyToCourse(courseId, facultyField, user);
    setMsg(error ? error.message : "Faculty assigned");
  }

  if (!course) return <div>Loading...</div>;
  return (
    <div className="page page-course-detail">
      <h2>
        {course.code} - {course.title}
      </h2>
      <p>{course.description}</p>
      <p>
        <b>Faculty:</b> {course.faculty_name || "Unassigned"}
      </p>

      {user.role === "student" && (
        <div>
          {enrollmentStatus === "active" ? (
            <button className="btn-accent" onClick={handleDrop}>
              Drop Course
            </button>
          ) : (
            <button className="btn-accent" onClick={handleEnroll}>
              Enroll
            </button>
          )}
        </div>
      )}

      {user.role === "faculty" && (
        <div>
          <div>Your course management tools could go here.</div>
          {/* Integration point: fetch course roster, manage schedule, etc. */}
        </div>
      )}

      {user.role === "admin" && (
        <div style={{ marginTop: 16 }}>
          <h3>Assign Faculty</h3>
          <input
            placeholder="Faculty Email"
            value={facultyField}
            onChange={e => setFacultyField(e.target.value)}
          />
          <button className="btn-accent" onClick={handleAssignFaculty}>
            Assign
          </button>
        </div>
      )}

      {msg && <div className="msg-status">{msg}</div>}
    </div>
  );
}
export default CourseDetailPage;
