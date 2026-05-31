import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { hourlyData, typeData, CHART_COLORS } from "../data/threatData";

const tooltipStyle = {
  contentStyle: {
    background: "#090d14", border: "1px solid #0a2a3a",
    borderRadius: "2px", fontSize: "11px", color: "#aac",
  },
};

export default function Charts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
      {/* Bar Chart */}
      <div style={{
        background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
        borderRadius: "2px", padding: "18px",
      }}>
        <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em", marginBottom: "14px" }}>
          HOURLY ATTACK VOLUME
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={hourlyData}>
            <XAxis dataKey="hour" tick={{ fill: "#3a5a7a", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#3a5a7a", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="attacks" fill="#00e5ff" opacity={0.7} radius={[1, 1, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={{
        background: "rgba(10,15,25,0.9)", border: "1px solid #0a1a2a",
        borderRadius: "2px", padding: "18px",
      }}>
        <div style={{ fontSize: "10px", color: "#3a5a7a", letterSpacing: "0.15em", marginBottom: "14px" }}>
          THREAT DISTRIBUTION
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={typeData} cx="50%" cy="50%"
              innerRadius={35} outerRadius={60}
              dataKey="value" paddingAngle={3}
            >
              {typeData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
