import React, { useState, useEffect, useRef } from "react";
import Login    from "./components/Login";
import Register from "./components/Register";
import StatCard     from "./components/StatCard";
import ThreatTable  from "./components/ThreatTable";
import AlertPanel   from "./components/AlertPanel";
import Charts       from "./components/Charts";
import TerminalLog  from "./components/TerminalLog";
import SystemStatus from "./components/SystemStatus";
import { initialThreats, threatPool } from "./data/threatData";

const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050810; }
  @keyframes scanline {
    0%   { top: -2px; }
    100% { top: 100%; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes blink {
    0%,  49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  ::-webkit-scrollbar       { width: 4px; }
  ::-webkit-scrollbar-track { background: #080c14; }
  ::-webkit-scrollbar-thumb { background: #1a3a5a; border-radius: 2px; }
`;

// ── Pages ─────────────────────────────────────────────
// "login" | "register" | "dashboard"

export default function App() {
  const [page,      setPage]      = useState("login");
  const [user,      setUser]      = useState(null);
  const [threats,   setThreats]   = useState(initialThreats);
  const [alerts,    setAlerts]    = useState([]);
  const [monitoring,setMonitoring]= useState(true);
  const [tick,      setTick]      = useState(0);
  const nextId = useRef(100);

  // Auto-generate threats (only when dashboard is shown)
  useEffect(() => {
    if (page !== "dashboard" || !monitoring) return;
    const interval = setInterval(() => {
      const t    = threatPool[Math.floor(Math.random() * threatPool.length)];
      const time = new Date().toTimeString().slice(0, 8);
      const newThreat = { ...t, id: nextId.current++, time };
      setThreats((prev) => [newThreat, ...prev].slice(0, 50));
      setAlerts ((prev) => [newThreat, ...prev].slice(0, 5));
      setTick   ((n)    => n + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [page, monitoring]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setThreats(initialThreats);
    setAlerts([]);
    setTick(0);
  };

  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const critCount = threats.filter((t) => t.level === "Critical").length;
  const highCount = threats.filter((t) => t.level === "High").length;
  const uniqueIPs = new Set(threats.map((t) => t.ip)).size;

  // ── Render pages ──────────────────────────────────────
  if (page === "register") {
    return (
      <>
        <style>{globalStyles}</style>
        <Register onSwitchToLogin={() => setPage("login")} />
      </>
    );
  }

  if (page === "login") {
    return (
      <>
        <style>{globalStyles}</style>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage("register")}
        />
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────────────
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#050810", color: "#c0d0e0", fontFamily: "'Courier New', monospace" }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(180deg,#060c18 0%,#050810 100%)",
          borderBottom: "1px solid #0a1a2a",
          padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "40px", height: "40px", border: "2px solid #00e5ff33",
              borderRadius: "2px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "20px",
            }}>🛡</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.15em", color: "#e0f0ff" }}>
                CYBER<span style={{ color: "#00e5ff" }}>SENTINEL</span>
              </div>
              <div style={{ fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.2em" }}>
                REAL-TIME THREAT MONITORING v2.1
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Welcome */}
            <div style={{ fontSize: "11px", color: "#3a5a7a" }}>
              Welcome, <span style={{ color: "#00e5ff" }}>{user?.username}</span>
            </div>

            {/* Monitor toggle */}
            <div style={{ fontSize: "11px", color: "#2a5a3a" }}>
              <span style={{
                display: "inline-block", width: "8px", height: "8px",
                borderRadius: "50%", background: monitoring ? "#39ff14" : "#ff3e3e",
                marginRight: "8px", animation: monitoring ? "pulse 1.5s infinite" : "none",
              }} />
              {monitoring ? "MONITORING ACTIVE" : "MONITORING PAUSED"}
            </div>

            <button onClick={() => setMonitoring((m) => !m)} style={{
              background: monitoring ? "rgba(255,30,30,0.1)" : "rgba(57,255,20,0.1)",
              border: `1px solid ${monitoring ? "#ff3e3e" : "#39ff14"}`,
              color: monitoring ? "#ff4444" : "#39ff14",
              padding: "6px 16px", borderRadius: "2px", cursor: "pointer",
              fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", fontWeight: "700",
            }}>
              {monitoring ? "⏸ PAUSE" : "▶ RESUME"}
            </button>

            {/* Logout */}
            <button onClick={handleLogout} style={{
              background: "transparent", border: "1px solid #1a3a5a",
              color: "#3a5a7a", padding: "6px 16px", borderRadius: "2px",
              cursor: "pointer", fontSize: "11px", fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}>
              LOGOUT
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            <StatCard label="Total Threats" value={threats.length} accent="#00e5ff" icon="🔍" sub={`+${tick} this session`} />
            <StatCard label="Critical"       value={critCount}      accent="#ff1e1e" icon="🚨" sub="Immediate action required" />
            <StatCard label="High Severity"  value={highCount}      accent="#ff8c00" icon="⚠"  sub="Monitor closely" />
            <StatCard label="Unique IPs"     value={uniqueIPs}      accent="#39ff14" icon="🌐" sub="Distinct sources" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Charts />
              <ThreatTable threats={threats} />
              <TerminalLog threats={threats.slice(0, 15)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <AlertPanel alerts={alerts} onDismiss={dismissAlert} monitoring={monitoring} />
              <SystemStatus threats={threats} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
