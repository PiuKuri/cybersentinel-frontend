import React from "react";
import { levelColors } from "../data/threatData";

function AlertToast({ alert, onDismiss }) {
  const c = levelColors[alert.level] || levelColors.Low;
  return (
    <div style={{
      background: "#090d14",
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: "2px",
      padding: "14px 18px",
      marginBottom: "10px",
      animation: "slideIn 0.3s ease",
      position: "relative",
      fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: c.text, fontWeight: "700", fontSize: "12px", letterSpacing: "0.08em" }}>
            ⚠ {alert.type.toUpperCase()} DETECTED
          </div>
          <div style={{ color: "#5a6a7a", fontSize: "11px", marginTop: "4px" }}>
            IP: <span style={{ color: "#aaa" }}>{alert.ip}</span> · {alert.time}
          </div>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          style={{
            background: "transparent", border: "none", color: "#3a4a5a",
            cursor: "pointer", fontSize: "16px", padding: "0 0 0 12px", lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function AlertPanel({ alerts, onDismiss, monitoring }) {
  return (
    <div style={{
      background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
      borderRadius: "2px", padding: "18px", flex: 1,
    }}>
      <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em", marginBottom: "16px" }}>
        LIVE ALERTS
        {monitoring && (
          <span style={{ marginLeft: "8px", color: "#39ff14", animation: "blink 1s infinite" }}>●</span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div style={{ color: "#1a3a2a", fontSize: "12px", textAlign: "center", padding: "30px 0" }}>
          No active alerts
        </div>
      ) : (
        alerts.map((a) => (
          <AlertToast key={a.id} alert={a} onDismiss={onDismiss} />
        ))
      )}
    </div>
  );
}
