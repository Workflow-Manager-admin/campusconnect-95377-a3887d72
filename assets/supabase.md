# Supabase Configuration for Course Management App

## Supabase Project: `course_management_app`
- **Supabase URL**: https://pqcdtwvebdfjpwvuporl.supabase.co
- **Supabase Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxY2R0d3ZlYmRmanB3dnVwb3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTMwNTcsImV4cCI6MjA2NjkyOTA1N30.EObLl5K-OmxiDTkTd726OZSBhEe6OONn3AQRFaguq9M`
- **Database URL**: `postgresql://postgres:Supabase%2123@db.pqcdtwvebdfjpwvuporl.supabase.co:5432/postgres`

## Intended Database Schema

### User Authentication Table

- `students` (Users: students, faculty, admin by role field)
    - `id`: uuid (PK, auto-generated)
    - `email`: text (unique)
    - `name`: text
    - `password_hash`: text (hashed passwords, unless you use Supabase Auth)
    - `role`: text (`student`, `faculty`, `admin`)

### Courses Table
- `courses`
    - `id`: uuid (PK, auto-generated)
    - `code`: text (course code)
    - `title`: text
    - `description`: text
    - `faculty_id`: uuid (FK → students.id, nullable for unassigned courses)

### Enrollment Table
- `enrollments`
    - `id`: uuid (PK, auto-generated)
    - `student_id`: uuid (FK → students.id)
    - `course_id`: uuid (FK → courses.id)
    - `status`: text (e.g., active, dropped, completed)

### Notifications Table
- `notifications`
    - `id`: uuid (PK, auto-generated)
    - `recipient_id`: uuid (FK → students.id)
    - `message`: text
    - `created_at`: timestamp with TZ (default now)
    - `read`: boolean (default false)

## API & Auth Setup

- **User Auth**: Supabase Auth is recommended for secure, managed authentication.
- **Row-Level Security Policies**: Should be added for access control on each table.
- **Table Creation**: Use the Supabase Dashboard or SQL scripts, as API-level table creation is not available on this instance.

## Manual Setup Required

Due to limited API/database permissions or missing RPCs on this Supabase project, please:
  1. Create the above tables via the Supabase Dashboard or psql access.
  2. Set up authentication using Supabase Auth (email/password sign-in recommended).
  3. Add RLS policies for appropriate user access (students can see only their enrollments, etc.).
  4. Add any additional tables or relations according to further app features.

---

This file should be kept updated with any changes to Supabase configuration, environment variable usage, or schema changes.
