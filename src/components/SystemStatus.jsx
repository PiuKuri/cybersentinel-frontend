import React from "react";
import { levelColors } from "../data/threatData";

const STATUS_ITEMS = [
  { label: "Detector",   val: "ONLINE",     ok: true  },
  { label: "Database",   val: "CONNECTED",  ok: true  },
  { label: "Log Engine", val: "RUNNING",    ok: true  },
  { label: "Firewall",   val: "ACTIVE",     ok: true  },
];

export default function SystemStatus({ threats }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Severity Legend */}
      <div style={{
        background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
        borderRadius: "2px", padding: "18px",
      }}>
        <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em", marginBottom: "14px" }}>
          SEVERITY LEGEND
        </div>
        {Object.entries(levelColors).map(([lvl, c]) => (
          <div key={lvl} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: c.text, boxShadow: `0 0 6px ${c.text}`,
            }} />
            <div style={{ fontSize: "11px", color: c.text, flex: 1 }}>{lvl}</div>
            <div style={{ fontSize: "10px", color: "#2a4a5a" }}>
              {threats.filter((t) => t.level === lvl).length} events
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div style={{
        background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
        borderRadius: "2px", padding: "18px",
      }}>
        <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em", marginBottom: "14px" }}>
          SYSTEM STATUS
        </div>
        {STATUS_ITEMS.map((s) => (
          <div key={s.label} style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "6px", fontSize: "11px", fontFamily: "monospace",
          }}>
            <span style={{ color: "#3a5a7a" }}>{s.label}</span>
            <span style={{ color: s.ok ? "#39ff14" : "#ff3e3e", fontWeight: "700" }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
