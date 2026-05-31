import React from "react";

function ScanLine() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: "none", overflow: "hidden", borderRadius: "inherit",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)",
        animation: "scanline 4s linear infinite",
      }} />
    </div>
  );
}

export default function StatCard({ label, value, accent, icon, sub }) {
  return (
    <div style={{
      background: "rgba(10,15,25,0.9)",
      border: `1px solid ${accent}33`,
      borderTop: `2px solid ${accent}`,
      borderRadius: "2px",
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
      flex: 1,
      minWidth: 0,
    }}>
      <ScanLine />
      <div style={{
        fontSize: "11px", color: "#5a6a7a", letterSpacing: "0.15em",
        textTransform: "uppercase", marginBottom: "8px", fontFamily: "monospace",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "38px", fontWeight: "800", color: accent,
        fontFamily: "'Courier New', monospace", lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "11px", color: "#3a4a5a", marginTop: "6px", fontFamily: "monospace" }}>
          {sub}
        </div>
      )}
      <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "22px", opacity: 0.25 }}>
        {icon}
      </div>
    </div>
  );
}
