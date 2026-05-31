export const initialThreats = [
  { id: 1, ip: "192.168.1.105", type: "Brute Force",   level: "High",     time: "14:52:01" },
  { id: 2, ip: "10.0.0.44",     type: "Port Scan",     level: "Medium",   time: "14:53:18" },
  { id: 3, ip: "172.16.0.23",   type: "SQL Injection", level: "Critical", time: "14:54:05" },
  { id: 4, ip: "192.168.1.200", type: "Blacklisted IP",level: "High",     time: "14:55:32" },
  { id: 5, ip: "10.0.0.88",     type: "Failed Login",  level: "Low",      time: "14:56:49" },
];

export const threatPool = [
  { ip: "203.0.113.42",  type: "DDoS Attempt",    level: "Critical" },
  { ip: "198.51.100.7",  type: "Brute Force",      level: "High"     },
  { ip: "10.0.0.99",     type: "Port Scan",        level: "Medium"   },
  { ip: "192.168.2.55",  type: "Phishing Link",    level: "High"     },
  { ip: "172.16.5.11",   type: "Malware Traffic",  level: "Critical" },
  { ip: "10.10.0.3",     type: "Failed Login",     level: "Low"      },
  { ip: "203.0.113.88",  type: "SQL Injection",    level: "Critical" },
];

export const hourlyData = [
  { hour: "09:00", attacks: 3  },
  { hour: "10:00", attacks: 7  },
  { hour: "11:00", attacks: 5  },
  { hour: "12:00", attacks: 12 },
  { hour: "13:00", attacks: 8  },
  { hour: "14:00", attacks: 15 },
  { hour: "15:00", attacks: 6  },
  { hour: "16:00", attacks: 9  },
];

export const typeData = [
  { name: "Brute Force",   value: 34 },
  { name: "Port Scan",     value: 22 },
  { name: "SQL Injection", value: 18 },
  { name: "Blacklisted IP",value: 26 },
];

export const CHART_COLORS = ["#ff3e3e", "#ff8c00", "#00e5ff", "#39ff14"];

export const levelColors = {
  Critical: { bg: "rgba(255,30,30,0.15)",  border: "#ff1e1e", text: "#ff4444" },
  High:     { bg: "rgba(255,140,0,0.15)",  border: "#ff8c00", text: "#ffa500" },
  Medium:   { bg: "rgba(0,229,255,0.12)",  border: "#00e5ff", text: "#00d4ee" },
  Low:      { bg: "rgba(57,255,20,0.1)",   border: "#39ff14", text: "#39ff14" },
};
