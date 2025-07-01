import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../supabaseClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  async function handleLogin(e) {
    e.preventDefault();
    setErrMsg("");
    const { error } = await signInUser(email, password);
    if (error) setErrMsg(error.message || "Login failed");
    else navigate("/");
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errMsg && <div className="auth-err">{errMsg}</div>}
        <button type="submit" className="btn-accent">
          Login
        </button>
        <div className="auth-switch">
          Don&apos;t have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
