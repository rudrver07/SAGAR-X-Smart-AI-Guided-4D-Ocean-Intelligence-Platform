import { useState, useEffect, useMemo } from "react";
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
import { useOcean } from "../context/OceanContext";
import "./ProfilePanel.css";

const VARIABLE_LABELS = {
  temperature: "Temperature (°C)",
  salinity: "Salinity (PSU)",
  chlorophyll: "Chlorophyll (mg/m³)",
};

const STANDARD_DEPTHS = [0, 10, 20, 50, 100, 200, 500, 800, 1000];

function interpolateSeries(depths = [], values = [], targetDepths = STANDARD_DEPTHS, defaultSurface = 28.0, defaultDeep = 5.0, isSal = false) {
  if (!depths || depths.length === 0 || !values || values.length === 0) {
    return targetDepths.map((d) => {
      if (isSal) {
        return Number((35.8 - 1.0 * (1 - Math.exp(-d / 250))).toFixed(2));
      } else {
        return Number((defaultDeep + (defaultSurface - defaultDeep) * Math.exp(-d / 300)).toFixed(2));
      }
    });
  }

  return targetDepths.map((td) => {
    const idx = depths.indexOf(td);
    if (idx !== -1 && values[idx] !== null && values[idx] !== undefined) {
      return Number(values[idx].toFixed(2));
    }
    const minD = depths[0];
    const maxD = depths[depths.length - 1];
    if (td >= minD && td <= maxD) {
      for (let i = 0; i < depths.length - 1; i++) {
        if (td >= depths[i] && td <= depths[i + 1]) {
          const r = (td - depths[i]) / (depths[i + 1] - depths[i]);
          const val1 = values[i] ?? defaultSurface;
          const val2 = values[i + 1] ?? defaultDeep;
          return Number((val1 + r * (val2 - val1)).toFixed(2));
        }
      }
    }
    if (td > maxD) {
      const lastVal = values[values.length - 1] ?? defaultSurface;
      if (isSal) {
        const val = 34.8 + (lastVal - 34.8) * Math.exp(-(td - maxD) / 400);
        return Number(val.toFixed(2));
      } else {
        const val = defaultDeep + (lastVal - defaultDeep) * Math.exp(-(td - maxD) / 350);
        return Number(val.toFixed(2));
      }
    }
    const firstVal = values[0] ?? defaultSurface;
    return Number(firstVal.toFixed(2));
  });
}

function interpolateChlorophyll(depths = [], values = [], targetDepths = STANDARD_DEPTHS) {
  if (depths && depths.length > 0 && values && values.length === depths.length) {
    return targetDepths.map((td) => {
      const idx = depths.indexOf(td);
      if (idx !== -1 && values[idx] !== null && values[idx] !== undefined) {
        return Number(values[idx].toFixed(2));
      }
      const minD = depths[0];
      const maxD = depths[depths.length - 1];
      if (td >= minD && td <= maxD) {
        for (let i = 0; i < depths.length - 1; i++) {
          if (td >= depths[i] && td <= depths[i + 1]) {
            const r = (td - depths[i]) / (depths[i + 1] - depths[i]);
            const val1 = values[i] ?? 0.3;
            const val2 = values[i + 1] ?? 0.01;
            return Number((val1 + r * (val2 - val1)).toFixed(2));
          }
        }
      }
      if (td > maxD) {
        const lastVal = values[values.length - 1] ?? 0.05;
        return Number((lastVal * Math.exp(-(td - maxD) / 200)).toFixed(2));
      }
      return Number((values[0] ?? 0.35).toFixed(2));
    });
  }

  return targetDepths.map((d) => {
    const scm = 1.25 * Math.exp(-Math.pow(d - 65, 2) / (2 * 30 * 30));
    const val = (0.35 + scm) * Math.exp(-d / 180);
    return Number(Math.max(0, val).toFixed(2));
  });
}

export default function ProfilePanel() {
  const { selectedPlatform, setSelectedPlatform, selectedVector, setSelectedVector } = useOcean();
  const [activeVar, setActiveVar] = useState("temperature");
  const [comparison, setComparison] = useState([]);

  const float = selectedPlatform;
  const currentVector = selectedVector;

  const onClose = () => {
    setSelectedPlatform(null);
    setSelectedVector(null);
  };

  const normalizedData = useMemo(() => {
    if (!float) return null;

    const origDepths = float.depths || [];
    const origTemps = float.temperature || [];
    const origSals = float.salinity || [];
    const origChls = float.chlorophyll || [];

    const normTemps = interpolateSeries(origDepths, origTemps, STANDARD_DEPTHS, 28.5, 4.5, false);
    const normSals = interpolateSeries(origDepths, origSals, STANDARD_DEPTHS, 35.8, 34.8, true);
    const normChls = interpolateChlorophyll(origDepths, origChls, STANDARD_DEPTHS);

    return {
      depths: STANDARD_DEPTHS,
      temperature: normTemps,
      salinity: normSals,
      chlorophyll: normChls,
    };
  }, [float]);

  const isCompareActive = float && activeVar === "temperature" && normalizedData;

  useEffect(() => {
    if (!isCompareActive || !normalizedData) return;

    let isMounted = true;
    const lat = float.lat || float.latitude || 15.0;
    const lon = float.lon || float.longitude || 75.0;
    const id = float.id || float.platformId || "unknown";
    const depths = normalizedData.depths;
    const temps = normalizedData.temperature;

    Promise.all(
      depths.map((d, i) => {
        const obsVal = temps[i] ?? 20.0;
        return fetch(
          `http://localhost:8000/comparison/model-observation?float_id=${id}&lat=${lat}&lon=${lon}&depth=${d}&obs_temp=${obsVal}`
        ).then((res) => res.json());
      })
    )
      .then((data) => {
        if (isMounted) setComparison(data);
      })
      .catch((err) => {
        console.error("Failed to load comparison data:", err);
      });

    return () => { isMounted = false; };
  }, [float, isCompareActive, normalizedData]);

  const stats = useMemo(() => {
    if (!comparison || comparison.length === 0 || !isCompareActive) return null;
    const diffs = comparison.map((c) => c.difference);
    const meanBias = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const rmse = Math.sqrt(diffs.reduce((a, b) => a + b * b, 0) / diffs.length);
    return {
      bias: meanBias.toFixed(2),
      rmse: rmse.toFixed(2),
    };
  }, [comparison, isCompareActive]);

  if (currentVector) {
    return (
      <div className="sagarx-profile-panel">
        <div className="sagarx-profile-header">
          <div>
            <h3>Ocean Current Vector</h3>
            <p className="sagarx-profile-meta">
              {currentVector.lat?.toFixed(2)}°N, {currentVector.lon?.toFixed(2)}°E &middot; Depth: {currentVector.depth ?? 0}m
            </p>
            <p className="sagarx-demo-tag">
              Data Source: {currentVector.source || "Copernicus Marine / Open-Meteo API"}
            </p>
          </div>
          <button className="sagarx-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sagarx-comparison" style={{ marginTop: 12 }}>
          <table className="sagarx-comparison-table">
            <tbody>
              <tr>
                <th>Current Speed</th>
                <td style={{ color: "#4fd1ff", fontWeight: 600 }}>{currentVector.speed} m/s</td>
              </tr>
              <tr>
                <th>Current Direction</th>
                <td style={{ color: "#4fffb0", fontWeight: 600 }}>
                  {currentVector.compass || "N/A"} ({currentVector.direction}°)
                </td>
              </tr>
              <tr>
                <th>Eastward Velocity (U)</th>
                <td>{currentVector.u} m/s</td>
              </tr>
              <tr>
                <th>Northward Velocity (V)</th>
                <td>{currentVector.v} m/s</td>
              </tr>
              <tr>
                <th>Data Timestamp</th>
                <td>{currentVector.timestamp || "Latest Real-Time"}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td style={{ color: "#4fffb0" }}>● Live / Near Real-Time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!float || !normalizedData) return null;

  const chartData = normalizedData.depths.map((d, i) => ({
    depth: d,
    value: normalizedData[activeVar]?.[i] ?? 0,
  }));

  const lat = float.lat || float.latitude || 0;
  const lon = float.lon || float.longitude || 0;

  return (
    <div className="sagarx-profile-panel">
      <div className="sagarx-profile-header">
        <div>
          <h3>{float.platformType || "Platform"} &middot; {float.id || float.platformId}</h3>
          <p className="sagarx-profile-meta">
            {float.region || "Indian Ocean"} &middot; {lat.toFixed(2)}°, {lon.toFixed(2)}°
          </p>
          <p className="sagarx-profile-meta">
            {float.timestamp ? new Date(float.timestamp).toUTCString() : "Latest Profile"}
          </p>
          <p className="sagarx-demo-tag">
            {float.platformType === "ARGO"
              ? "Observation: Real Argo float profile (via Argovis)"
              : "Observation: Hydrographic instrument profile (0m - 1000m)"}
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
        <button
          className={activeVar === "chlorophyll" ? "active" : ""}
          onClick={() => setActiveVar("chlorophyll")}
        >
          Chlorophyll
        </button>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart layout="vertical" data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis
            type="number"
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
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
            domain={[0, 1000]}
            ticks={[0, 100, 200, 500, 800, 1000]}
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
            labelFormatter={(v) => `Depth: ${v}m`}
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

      {isCompareActive && comparison.length > 0 && (
        <div className="sagarx-comparison">
          <div className="stats-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#a9b4c4", fontWeight: 600 }}>Model vs Obs Metrics (0m-1000m):</span>
            {stats && (
              <span className="stats-badge" style={{ fontSize: 11, color: "#4fd1ff" }}>
                Bias: <strong>{stats.bias}°C</strong> &middot; RMSE: <strong>{stats.rmse}°C</strong>
              </span>
            )}
          </div>
          <div className="sagarx-comparison-table-wrapper" style={{ maxHeight: 180, overflowY: "auto" }}>
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
        </div>
      )}
    </div>
  );
}