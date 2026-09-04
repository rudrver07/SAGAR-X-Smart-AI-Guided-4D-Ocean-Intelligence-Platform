import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import "./ProfilePanel.css";

const VARIABLE_LABELS = { temperature: "Temperature (°C)", salinity: "Salinity (PSU)" };

export default function ProfilePanel({ float, onClose }) {
  const [activeVar, setActiveVar] = useState("temperature");

  if (!float) return null;

  const chartData = float.depths.map((d, i) => ({
    depth: d,
    value: float[activeVar][i],
  }));

  return (
    <div className="sagarx-profile-panel">
      <div className="sagarx-profile-header">
        <div>
          <h3>{float.id}</h3>
          <p className="sagarx-profile-meta">
            {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}° &middot;{" "}
            {new Date(float.timestamp).toUTCString()}
          </p>
          <p className="sagarx-demo-tag">DEMO DATA — NOT REAL OBSERVATION</p>
        </div>
        <button className="sagarx-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="sagarx-profile-toggle">
        <button
          className={activeVar === "temperature" ? "active" : ""}
          onClick={() => setActiveVar("temperature")}
        >
          Temperature
        </button>
        <button
          className={activeVar === "salinity" ? "active" : ""}
          onClick={() => setActiveVar("salinity")}
        >
          Salinity
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis
          dataKey="value"
          type="number"
          domain={["dataMin - 1", "dataMax + 1"]}
          stroke="#a9b4c4"
          tickFormatter={(v) => v.toFixed(1)}
          label={{
            value: VARIABLE_LABELS[activeVar],
            position: "insideBottom",
            offset: -5,
            fill: "#a9b4c4",
            fontSize: 11,
          }}
          />
          <YAxis
            dataKey="depth"
            type="number"
            reversed
            stroke="#a9b4c4"
            label={{
              value: "Depth (m)",
              angle: -90,
              position: "insideLeft",
              fill: "#a9b4c4",
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{ background: "#141a26", border: "1px solid rgba(255,255,255,0.1)" }}
            labelFormatter={(v) => `Value: ${v}`}
          />
          <Line type="monotone" dataKey="value" stroke="#4fd1ff" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
        <Brush
        dataKey="depth"
        height={20}
        stroke="#4fd1ff"
        fill="rgba(79,209,255,0.08)"
        travellerWidth={8}
        />
      </ResponsiveContainer>
    </div>
  );
}