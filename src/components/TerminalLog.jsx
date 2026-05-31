import React, { useEffect, useRef } from "react";
import { levelColors } from "../data/threatData";

export default function TerminalLog({ threats }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threats]);

  return (
    <div style={{
      background: "#040608", border: "1px solid #0f2030",
      borderRadius: "2px", padding: "14px", height: "180px",
      overflowY: "auto", fontFamily: "'Courier New', monospace", fontSize: "11px",
    }}>
      <div style={{ color: "#1a3a2a", marginBottom: "8px" }}>
        ── SYSTEM LOG ── [LIVE] ──────────────────────────
      </div>
      {[...threats].reverse().map((t) => (
        <div key={t.id} style={{ marginBottom: "4px" }}>
          <span style={{ color: "#1e4a2a" }}>[{t.time}]</span>
          <span style={{ color: "#3a7a4a" }}> THREAT</span>
          <span style={{ color: "#5a8a5a" }}>::{t.type}</span>
          <span style={{ color: "#4a7a8a" }}> from {t.ip}</span>
          <span style={{ color: levelColors[t.level]?.text || "#aaa" }}> [{t.level}]</span>
        </div>
      ))}
      <div style={{ color: "#1a3a2a" }}>█ _</div>
      <div ref={bottomRef} />
    </div>
  );
}
