import { useState, useEffect } from "react";
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

const VARIABLE_LABELS = {
  temperature: "Temperature (°C)",
  salinity: "Salinity (PSU)",
  chlorophyll: "Chlorophyll (mg/m³)",
};

export default function ProfilePanel({ float, onClose }) {
  const [activeVar, setActiveVar] = useState("temperature");
  const [comparison, setComparison] = useState([]);

  // Fetch model-vs-observation comparison whenever a new float is
  // selected and the Temperature tab is active (comparison is
  // temperature-only for now, per the backend's /comparison endpoint).
  useEffect(() => {
    if (!float || activeVar !== "temperature") {
      setComparison([]);
      return;
    }

    Promise.all(
      float.depths.map((d, i) =>
        fetch(
          `http://localhost:8000/comparison/model-observation?float_id=${float.id}&lat=${float.lat}&lon=${float.lon}&depth=${d}&obs_temp=${float.temperature[i]}`
        ).then((res) => res.json())
      )
    )
      .then(setComparison)
      .catch((err) => {
        console.error("Failed to load comparison data:", err);
        setComparison([]);
      });
  }, [float, activeVar]);

  if (!float) return null;

  const chartData = float.depths.map((d, i) => ({
    depth: d,
    value: float[activeVar][i],
  }));

  return (
    <div className="sagarx-profile-panel">
      <div className="sagarx-profile-header">
        <div>
          <h3>{float.region}</h3>
          <p className="sagarx-profile-meta">
            {float.id} &middot; {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}°
          </p>
          <p className="sagarx-profile-meta">
            {new Date(float.timestamp).toUTCString()}
          </p>
          <p className="sagarx-demo-tag">
            Observation: real Argo data (via Argovis)
          </p>
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
        {float.chlorophyll && (
          <button
            className={activeVar === "chlorophyll" ? "active" : ""}
            onClick={() => setActiveVar("chlorophyll")}
          >
            Chlorophyll
          </button>
        )}
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
          <Brush
            dataKey="depth"
            height={20}
            stroke="#4fd1ff"
            fill="rgba(79,209,255,0.08)"
            travellerWidth={8}
          />
        </LineChart>
      </ResponsiveContainer>

      {activeVar === "temperature" && comparison.length > 0 && (
        <div className="sagarx-comparison">
          <p className="sagarx-demo-tag">
            {float.id.startsWith("GLIDER")
              ? "DEMO DATA — NOT REAL OBSERVATION"
              : "Observation: real Argo data (via Argovis)"}
          </p>
          <table className="sagarx-comparison-table">
            <thead>
              <tr>
                <th>Depth</th>
                <th>Observed</th>
                <th>Model</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c) => (
                <tr key={c.depth}>
                  <td>{c.depth}m</td>
                  <td>{c.observed_temperature}°C</td>
                  <td>{c.model_temperature}°C</td>
                  <td style={{ color: c.difference > 0 ? "#ff8a8a" : "#8ad0ff" }}>
                    {c.difference > 0 ? "+" : ""}
                    {c.difference}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}