import React, { useState, useEffect } from "react";
import { fetchAllCourses, addCourse, deleteCourse } from "../supabaseClient";

/**
 * Admin control panel to manage courses.
 */
function AdminPanelPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadCourses() {
      setCourses(await fetchAllCourses());
    }
    loadCourses();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const { error } = await addCourse(form);
    setMsg(error ? error.message : "Course added successfully");
    setCourses(await fetchAllCourses());
    setForm({ code: "", title: "", description: "" });
  }

  async function handleDelete(id) {
    await deleteCourse(id);
    setCourses(await fetchAllCourses());
  }

  return (
    <div className="page page-admin">
      <h2>Admin Panel</h2>
      <form className="admin-add-course" onSubmit={handleAdd}>
        <input
          placeholder="Course code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <input
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Course description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn-accent" type="submit">
          Add Course
        </button>
      </form>
      {msg && <div className="msg-status">{msg}</div>}
      <h3>All Courses</h3>
      <ul className="admin-courses-list">
        {courses.map((c) => (
          <li key={c.id}>
            {c.code} – {c.title}{" "}
            <button className="admin-del-btn" onClick={() => handleDelete(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanelPage;
