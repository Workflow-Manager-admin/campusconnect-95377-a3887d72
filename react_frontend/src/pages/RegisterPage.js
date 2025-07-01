import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../supabaseClient";

// PUBLIC_INTERFACE
function RegisterPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setErrMsg("");
    const { error } = await signUpUser({ name, email, password, role });
    if (error) setErrMsg(error.message || "Registration failed");
    else navigate("/login");
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          autoFocus
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {errMsg && <div className="auth-err">{errMsg}</div>}
        <button type="submit" className="btn-accent">
          Register
        </button>
        <div className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
