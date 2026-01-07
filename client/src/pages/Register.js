import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/register", { email, password });
      nav("/login");
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h2>Register</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Create account</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </form>
      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
