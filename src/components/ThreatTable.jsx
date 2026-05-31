import React, { useState } from "react";
import { levelColors } from "../data/threatData";

const LEVELS = ["All", "Critical", "High", "Medium", "Low"];

function ThreatBadge({ level }) {
  const c = levelColors[level] || levelColors.Low;
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, fontSize: "10px", fontWeight: "700",
      padding: "2px 8px", borderRadius: "2px",
      fontFamily: "monospace", letterSpacing: "0.1em",
    }}>
      {level.toUpperCase()}
    </span>
  );
}

export default function ThreatTable({ threats }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? threats : threats.filter((t) => t.level === filter);

  return (
    <div style={{
      background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
      borderRadius: "2px", padding: "18px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em" }}>THREAT LOG</div>
        <div style={{ display: "flex", gap: "6px" }}>
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setFilter(l)} style={{
              background: filter === l ? "rgba(0,229,255,0.15)" : "transparent",
              border: `1px solid ${filter === l ? "#00e5ff" : "#0a1a2a"}`,
              color: filter === l ? "#00e5ff" : "#3a5a7a",
              padding: "3px 10px", borderRadius: "2px", cursor: "pointer",
              fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.08em",
            }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowY: "auto", maxHeight: "240px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #0a1a2a" }}>
              {["IP ADDRESS", "THREAT TYPE", "LEVEL", "TIME"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "6px 10px", fontSize: "9px",
                  color: "#2a4a6a", letterSpacing: "0.15em", fontWeight: "600",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((t, i) => (
              <tr key={t.id} style={{
                borderBottom: "1px solid #080c14",
                animation: i === 0 ? "slideIn 0.3s ease" : "none",
              }}>
                <td style={{ padding: "8px 10px", fontSize: "12px", color: "#7aaabf", fontFamily: "monospace" }}>{t.ip}</td>
                <td style={{ padding: "8px 10px", fontSize: "12px", color: "#8ab0c0" }}>{t.type}</td>
                <td style={{ padding: "8px 10px" }}><ThreatBadge level={t.level} /></td>
                <td style={{ padding: "8px 10px", fontSize: "11px", color: "#2a4a6a" }}>{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
