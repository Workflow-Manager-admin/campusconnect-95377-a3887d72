// Supabase client & API integration for authentication, courses, enrollments, schedule, notifications
// SUPABASE_URL and SUPABASE_KEY are in .env or project config.
// eslint-disable-next-line
import { createClient } from "@supabase/supabase-js";
// Environment variables can be used for these in deployment.
const SUPABASE_URL = "https://pqcdtwvebdfjpwvuporl.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxY2R0d3ZlYmRmanB3dnVwb3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTMwNTcsImV4cCI6MjA2NjkyOTA1N30.EObLl5K-OmxiDTkTd726OZSBhEe6OONn3AQRFaguq9M";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// PUBLIC_INTERFACE: Get current user (from Supabase auth)
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return null;
  // Fetch user profile (from students table)
  const { data: profile } = await supabase
    .from("students")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (profile) return { ...profile };
  // If not present in students table, fallback to Auth fields
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || data.user.email,
    role: "student",
  };
}

// PUBLIC_INTERFACE: Sign in user
export async function signInUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error };
}

// PUBLIC_INTERFACE: Sign up new user & create profile in students table
export async function signUpUser({ name, email, password, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  });
  if (error) return { error };
  // Insert into students table
  await supabase.from("students").upsert([{ id: data.user.id, name, email, role }]);
  return { user: data.user };
}

// PUBLIC_INTERFACE: Log out
export async function logoutUser() {
  await supabase.auth.signOut();
}

// PUBLIC_INTERFACE: Fetch all available courses for user and optional search query
export async function fetchCoursesForUser(user, query = "") {
  let q = supabase.from("courses").select("*, students:faculty_id(name)");
  if (query) q = q.ilike("title", `%${query}%`);
  const { data, error } = await q;
  if (!data) return [];
  return data.map((course) => ({
    ...course,
    faculty_name: course.students?.name || null,
  }));
}

// PUBLIC_INTERFACE: Fetch details for one course & user's enrollment status
export async function fetchCourseDetail(courseId, user) {
  // Get course info
  const { data: detail } = await supabase
    .from("courses")
    .select("*, students:faculty_id(name)")
    .eq("id", courseId)
    .single();
  // Get user's enrollment status
  let status = "none";
  if (user.role === "student") {
    const { data: enroll } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .single();
    status = enroll ? enroll.status : "none";
  }
  return { detail: { ...detail, faculty_name: detail?.students?.name }, status };
}

// PUBLIC_INTERFACE: Enroll user (student) in course
export async function enrollInCourse(courseId, user) {
  // Only students
  if (user.role !== "student") return { error: { message: "Not permitted" } };
  const { error } = await supabase
    .from("enrollments")
    .upsert([{ student_id: user.id, course_id: courseId, status: "active" }]);
  return { error };
}

// PUBLIC_INTERFACE: Drop course (student)
export async function dropCourse(courseId, user) {
  if (user.role !== "student") return { error: { message: "Not permitted" } };
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("student_id", user.id)
    .eq("course_id", courseId);
  return { error };
}

// PUBLIC_INTERFACE: Assign faculty to course (admin only)
export async function assignFacultyToCourse(courseId, facultyEmail, user) {
  if (user.role !== "admin") return { error: { message: "Not permitted" } };
  // Find faculty by email
  const { data: faculty } = await supabase
    .from("students")
    .select("id")
    .eq("email", facultyEmail)
    .eq("role", "faculty")
    .single();
  if (!faculty) return { error: { message: "Faculty not found" } };
  const { error } = await supabase
    .from("courses")
    .update({ faculty_id: faculty.id })
    .eq("id", courseId);
  return { error };
}

// PUBLIC_INTERFACE: Fetch user schedule
export async function fetchScheduleForUser(user) {
  if (user.role === "student") {
    // Student: courses in enrollments
    const { data } = await supabase
      .from("enrollments")
      .select("*, courses:course_id(id, code, title, faculty_id, students:faculty_id(name))")
      .eq("student_id", user.id)
      .eq("status", "active");
    if (!data) return [];
    return data.map(({ courses }) => ({
      id: courses.id,
      code: courses.code,
      title: courses.title,
      faculty_name: courses.students?.name,
    }));
  } else if (user.role === "faculty") {
    // Faculty: teaching assignments
    const { data } = await supabase
      .from("courses")
      .select("id, code, title, students:faculty_id(name)")
      .eq("faculty_id", user.id);
    if (!data) return [];
    return data.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      faculty_name: c.students?.name,
    }));
  }
  return [];
}

// PUBLIC_INTERFACE: Admin fetch all courses
export async function fetchAllCourses() {
  const { data } = await supabase.from("courses").select("*");
  return data || [];
}

// PUBLIC_INTERFACE: Admin add course
export async function addCourse({ code, title, description }) {
  return await supabase.from("courses").insert([{ code, title, description }]);
}

// PUBLIC_INTERFACE: Admin delete course
export async function deleteCourse(id) {
  return await supabase.from("courses").delete().eq("id", id);
}

// PUBLIC_INTERFACE: User fetch notifications
export async function fetchNotifications(user) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });
  return data || [];
}

// PUBLIC_INTERFACE: Mark notification as read
export async function markNotificationRead(id) {
  return await supabase.from("notifications").update({ read: true }).eq("id", id);
}

// More API integrations (rosters, scheduling) can be added here as needed.
