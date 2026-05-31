import API_URL from "../api";
import React, { useState } from "react";

const inputStyle = {
  width: "100%", background: "#040608",
  border: "1px solid #0a1a2a", borderRadius: "2px",
  padding: "12px 14px", color: "#c0d0e0",
  fontFamily: "monospace", fontSize: "13px",
  outline: "none", marginBottom: "14px",
  transition: "border-color 0.2s",
};

const btnStyle = (disabled) => ({
  width: "100%", padding: "13px",
  background: disabled ? "rgba(0,229,255,0.05)" : "rgba(0,229,255,0.15)",
  border: "1px solid #00e5ff",
  color: disabled ? "#3a5a7a" : "#00e5ff",
  fontFamily: "monospace", fontSize: "13px",
  fontWeight: "700", letterSpacing: "0.15em",
  cursor: disabled ? "not-allowed" : "pointer",
  borderRadius: "2px", transition: "all 0.2s",
});

export default function Register({ onSwitchToLogin }) {
  const [step,     setStep]     = useState("form"); // "form" | "otp"
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [email,    setEmail]    = useState("");

  const [form, setForm] = useState({
    username: "", email: "", password: "", confirm: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Submit registration form ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email:    form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setEmail(form.email);
      setSuccess(data.message);
      setStep("otp");
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("✅ Account verified! Redirecting to login...");
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch {
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("New OTP sent to your email!");
    } catch {
      setError("Cannot connect to backend.");
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
            {step === "form" ? "CREATE ACCOUNT" : "VERIFY EMAIL"}
          </div>
        </div>

        {/* Messages */}
        {error   && <div style={{ background: "rgba(255,30,30,0.1)", border: "1px solid #ff1e1e", color: "#ff4444", padding: "10px 14px", borderRadius: "2px", fontSize: "12px", marginBottom: "16px" }}>{error}</div>}
        {success && <div style={{ background: "rgba(57,255,20,0.08)", border: "1px solid #39ff14", color: "#39ff14", padding: "10px 14px", borderRadius: "2px", fontSize: "12px", marginBottom: "16px" }}>{success}</div>}

        {/* ── Registration Form ── */}
        {step === "form" && (
          <form onSubmit={handleRegister}>
            <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>USERNAME</label>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="min 3 characters" required style={inputStyle} />

            <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>EMAIL</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" required style={inputStyle} />

            <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>PASSWORD</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="8+ chars, upper, lower, number, symbol" required style={inputStyle} />

            <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>CONFIRM PASSWORD</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
              placeholder="re-enter password" required style={{ ...inputStyle, marginBottom: "20px" }} />

            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "SENDING OTP..." : "CREATE ACCOUNT →"}
            </button>
          </form>
        )}

        {/* ── OTP Form ── */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ fontSize: "12px", color: "#5a6a7a", marginBottom: "20px", lineHeight: "1.6" }}>
              A 6-digit OTP was sent to <span style={{ color: "#00e5ff" }}>{email}</span>. Enter it below.
            </div>
            <label style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>OTP CODE</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="123456" maxLength={6} required
              style={{ ...inputStyle, fontSize: "24px", textAlign: "center", letterSpacing: "0.3em", marginBottom: "20px" }} />

            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "VERIFYING..." : "VERIFY OTP →"}
            </button>
            <button type="button" onClick={handleResend} disabled={loading}
              style={{ ...btnStyle(loading), marginTop: "10px", background: "transparent", border: "1px solid #1a3a5a", color: "#3a5a7a" }}>
              RESEND OTP
            </button>
          </form>
        )}

        {/* Switch to login */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#3a5a7a" }}>
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}
            style={{ color: "#00e5ff", cursor: "pointer", textDecoration: "underline" }}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
