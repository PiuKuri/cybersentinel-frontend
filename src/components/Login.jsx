import API_URL from "../api";
import React, { useState } from "react";

const inputStyle = {
  width: "100%", background: "#040608",
  border: "1px solid #0a1a2a", borderRadius: "2px",
  padding: "12px 14px", color: "#c0d0e0",
  fontFamily: "monospace", fontSize: "13px",
  outline: "none", marginBottom: "14px",
};

const btnStyle = (disabled) => ({
  width: "100%", padding: "13px",
  background: disabled ? "rgba(0,229,255,0.05)" : "rgba(0,229,255,0.15)",
  border: "1px solid #00e5ff",
  color: disabled ? "#3a5a7a" : "#00e5ff",
  fontFamily: "monospace", fontSize: "13px",
  fontWeight: "700", letterSpacing: "0.15em",
  cursor: disabled ? "not-allowed" : "pointer",
  borderRadius: "2px",
});

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onLoginSuccess(data.user);
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050810",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", padding: "20px",
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "rgba(10,15,25,0.95)",
        border: "1px solid #0a1a2a", borderTop: "2px solid #00e5ff",
        borderRadius: "2px", padding: "40px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🛡</div>
          <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "0.15em", color: "#e0f0ff" }}>
            CYBER<span style={{ color: "#00e5ff" }}>SENTINEL</span>
          </div>
          <div style={{ fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.2em", marginTop: "4px" }}>
            SECURE ACCESS PORTAL
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,30,30,0.1)", border: "1px solid #ff1e1e",
            color: "#ff4444", padding: "10px 14px", borderRadius: "2px",
            fontSize: "12px", marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>EMAIL</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required style={inputStyle} />

          <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>PASSWORD</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required style={{ ...inputStyle, marginBottom: "20px" }} />

          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#3a5a7a" }}>
          Don't have an account?{" "}
          <span onClick={onSwitchToRegister}
            style={{ color: "#00e5ff", cursor: "pointer", textDecoration: "underline" }}>
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
