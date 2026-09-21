import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { OCEAN_REGIONS_INFO } from "../constants/oceanRegionInfo";
import { useOcean } from "../context/OceanContext";
import "./RegionalAnalysisModal.css";

// Depth profile datasets for regional ocean analysis
const REGIONAL_PROFILES_DATA = {
  arabian_sea: [
    { depth: 0, modelTemp: 29.8, obsTemp: 29.5, modelSal: 36.5, obsSal: 36.6, modelChl: 0.45, obsChl: 0.42 },
    { depth: 10, modelTemp: 29.6, obsTemp: 29.4, modelSal: 36.5, obsSal: 36.6, modelChl: 0.58, obsChl: 0.60 },
    { depth: 50, modelTemp: 26.2, obsTemp: 25.8, modelSal: 36.2, obsSal: 36.3, modelChl: 0.82, obsChl: 0.85 },
    { depth: 100, modelTemp: 22.1, obsTemp: 21.7, modelSal: 35.8, obsSal: 35.9, modelChl: 0.35, obsChl: 0.32 },
    { depth: 200, modelTemp: 17.5, obsTemp: 17.1, modelSal: 35.5, obsSal: 35.6, modelChl: 0.12, obsChl: 0.10 },
    { depth: 500, modelTemp: 11.2, obsTemp: 10.9, modelSal: 35.2, obsSal: 35.3, modelChl: 0.03, obsChl: 0.02 },
    { depth: 1000, modelTemp: 6.8, obsTemp: 6.5, modelSal: 34.9, obsSal: 35.0, modelChl: 0.01, obsChl: 0.01 },
  ],
  bay_of_bengal: [
    { depth: 0, modelTemp: 30.2, obsTemp: 30.0, modelSal: 32.1, obsSal: 32.3, modelChl: 0.52, obsChl: 0.55 },
    { depth: 10, modelTemp: 30.0, obsTemp: 29.9, modelSal: 32.4, obsSal: 32.6, modelChl: 0.65, obsChl: 0.68 },
    { depth: 50, modelTemp: 27.5, obsTemp: 27.1, modelSal: 34.2, obsSal: 34.4, modelChl: 0.75, obsChl: 0.78 },
    { depth: 100, modelTemp: 21.4, obsTemp: 20.9, modelSal: 34.8, obsSal: 34.9, modelChl: 0.28, obsChl: 0.25 },
    { depth: 200, modelTemp: 16.2, obsTemp: 15.8, modelSal: 35.0, obsSal: 35.1, modelChl: 0.08, obsChl: 0.07 },
    { depth: 500, modelTemp: 10.1, obsTemp: 9.8, modelSal: 35.1, obsSal: 35.1, modelChl: 0.02, obsChl: 0.02 },
    { depth: 1000, modelTemp: 6.2, obsTemp: 5.9, modelSal: 34.9, obsSal: 35.0, modelChl: 0.01, obsChl: 0.01 },
  ],
  indian_ocean: [
    { depth: 0, modelTemp: 28.5, obsTemp: 28.3, modelSal: 34.8, obsSal: 34.9, modelChl: 0.25, obsChl: 0.22 },
    { depth: 10, modelTemp: 28.4, obsTemp: 28.2, modelSal: 34.8, obsSal: 34.9, modelChl: 0.32, obsChl: 0.30 },
    { depth: 50, modelTemp: 25.8, obsTemp: 25.4, modelSal: 35.1, obsSal: 35.2, modelChl: 0.55, obsChl: 0.58 },
    { depth: 100, modelTemp: 20.8, obsTemp: 20.4, modelSal: 35.3, obsSal: 35.4, modelChl: 0.22, obsChl: 0.20 },
    { depth: 200, modelTemp: 15.6, obsTemp: 15.2, modelSal: 35.2, obsSal: 35.3, modelChl: 0.06, obsChl: 0.05 },
    { depth: 500, modelTemp: 9.5, obsTemp: 9.2, modelSal: 34.8, obsSal: 34.9, modelChl: 0.01, obsChl: 0.01 },
    { depth: 1000, modelTemp: 5.8, obsTemp: 5.5, modelSal: 34.7, obsSal: 34.8, modelChl: 0.00, obsChl: 0.00 },
  ],
  laccadive_sea: [
    { depth: 0, modelTemp: 29.5, obsTemp: 29.2, modelSal: 35.2, obsSal: 35.4, modelChl: 0.38, obsChl: 0.35 },
    { depth: 10, modelTemp: 29.3, obsTemp: 29.1, modelSal: 35.3, obsSal: 35.4, modelChl: 0.45, obsChl: 0.48 },
    { depth: 50, modelTemp: 26.5, obsTemp: 26.1, modelSal: 35.6, obsSal: 35.7, modelChl: 0.68, obsChl: 0.70 },
    { depth: 100, modelTemp: 21.8, obsTemp: 21.4, modelSal: 35.5, obsSal: 35.6, modelChl: 0.25, obsChl: 0.22 },
    { depth: 200, modelTemp: 16.8, obsTemp: 16.4, modelSal: 35.3, obsSal: 35.4, modelChl: 0.08, obsChl: 0.07 },
    { depth: 500, modelTemp: 10.8, obsTemp: 10.5, modelSal: 35.0, obsSal: 35.1, modelChl: 0.02, obsChl: 0.02 },
    { depth: 1000, modelTemp: 6.5, obsTemp: 6.2, modelSal: 34.8, obsSal: 34.9, modelChl: 0.01, obsChl: 0.01 },
  ],
  andaman_sea: [
    { depth: 0, modelTemp: 29.8, obsTemp: 29.6, modelSal: 32.8, obsSal: 33.0, modelChl: 0.48, obsChl: 0.50 },
    { depth: 10, modelTemp: 29.6, obsTemp: 29.4, modelSal: 33.0, obsSal: 33.2, modelChl: 0.55, obsChl: 0.58 },
    { depth: 50, modelTemp: 26.8, obsTemp: 26.4, modelSal: 34.1, obsSal: 34.3, modelChl: 0.72, obsChl: 0.75 },
    { depth: 100, modelTemp: 20.9, obsTemp: 20.5, modelSal: 34.6, obsSal: 34.7, modelChl: 0.26, obsChl: 0.24 },
    { depth: 200, modelTemp: 15.8, obsTemp: 15.4, modelSal: 34.8, obsSal: 34.9, modelChl: 0.07, obsChl: 0.06 },
    { depth: 500, modelTemp: 9.8, obsTemp: 9.5, modelSal: 34.9, obsSal: 35.0, modelChl: 0.01, obsChl: 0.01 },
    { depth: 1000, modelTemp: 6.0, obsTemp: 5.7, modelSal: 34.8, obsSal: 34.9, modelChl: 0.00, obsChl: 0.00 },
  ],
};

const REGIONAL_DIAGNOSTICS = {
  arabian_sea: {
    mld: "42 m",
    thermoclineGradient: "-0.095 °C/m",
    haloclineDepth: "55 m",
    omzDepth: "200m - 950m",
    bias: "+0.32 °C",
    rmse: "0.45 °C",
  },
  bay_of_bengal: {
    mld: "24 m",
    thermoclineGradient: "-0.110 °C/m",
    haloclineDepth: "30 m (Barrier Layer: 18m)",
    omzDepth: "150m - 800m",
    bias: "+0.25 °C",
    rmse: "0.38 °C",
  },
  indian_ocean: {
    mld: "58 m",
    thermoclineGradient: "-0.082 °C/m",
    haloclineDepth: "70 m",
    omzDepth: "N/A (Oxic Deep)",
    bias: "+0.28 °C",
    rmse: "0.41 °C",
  },
  laccadive_sea: {
    mld: "38 m",
    thermoclineGradient: "-0.088 °C/m",
    haloclineDepth: "48 m",
    omzDepth: "250m - 900m",
    bias: "+0.29 °C",
    rmse: "0.42 °C",
  },
  andaman_sea: {
    mld: "32 m",
    thermoclineGradient: "-0.105 °C/m",
    haloclineDepth: "38 m",
    omzDepth: "220m - 850m",
    bias: "+0.27 °C",
    rmse: "0.40 °C",
  },
};

export default function RegionalAnalysisModal({ isOpen, onClose, defaultRegionId }) {
  const { setRegion } = useOcean();
  const [selectedId, setSelectedId] = useState(defaultRegionId || "arabian_sea");
  const [selectedVar, setSelectedVar] = useState("temperature");

  if (!isOpen) return null;

  const currentRegion =
    OCEAN_REGIONS_INFO.find((r) => r.id === selectedId) || OCEAN_REGIONS_INFO[0];
  const profileData = REGIONAL_PROFILES_DATA[selectedId] || REGIONAL_PROFILES_DATA.arabian_sea;
  const diagnostics = REGIONAL_DIAGNOSTICS[selectedId] || REGIONAL_DIAGNOSTICS.arabian_sea;

  const handleFlyTo = () => {
    setRegion({
      lat: currentRegion.lat,
      lon: currentRegion.lon,
      name: currentRegion.name,
    });
  };

  const getVarConfig = () => {
    switch (selectedVar) {
      case "salinity":
        return {
          modelKey: "modelSal",
          obsKey: "obsSal",
          name: "Salinity",
          unit: "PSU",
          modelColor: "#00b4d8",
          obsColor: "#4fd1ff",
        };
      case "chlorophyll":
        return {
          modelKey: "modelChl",
          obsKey: "obsChl",
          name: "Chlorophyll",
          unit: "mg/m³",
          modelColor: "#39ff14",
          obsColor: "#7ee8fa",
        };
      default:
        return {
          modelKey: "modelTemp",
          obsKey: "obsTemp",
          name: "Temperature",
          unit: "°C",
          modelColor: "#ff7b00",
          obsColor: "#ffb703",
        };
    }
  };

  const varCfg = getVarConfig();

  return (
    <div className="sagarx-analysis-overlay">
      <div className="sagarx-analysis-modal">
        {/* Header */}
        <div className="sagarx-analysis-header">
          <div className="header-title">
            <span className="icon">📊</span>
            <div>
              <h2>Ocean Profile Graph & Regional Analysis</h2>
              <span className="subtitle">Vertical Water Column Profile (0m - 1000m Depth)</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Region Tabs */}
        <div className="sagarx-analysis-tabs">
          {OCEAN_REGIONS_INFO.map((reg) => (
            <button
              key={reg.id}
              className={`tab-btn ${reg.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(reg.id)}
            >
              📍 {reg.name}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="sagarx-analysis-body">
          {/* Controls Bar: Variable Switcher */}
          <div className="var-switcher-bar">
            <div className="var-btn-group">
              <button
                className={`var-btn ${selectedVar === "temperature" ? "active" : ""}`}
                onClick={() => setSelectedVar("temperature")}
              >
                🌡️ Temperature (°C)
              </button>
              <button
                className={`var-btn ${selectedVar === "salinity" ? "active" : ""}`}
                onClick={() => setSelectedVar("salinity")}
              >
                🧂 Salinity (PSU)
              </button>
              <button
                className={`var-btn ${selectedVar === "chlorophyll" ? "active" : ""}`}
                onClick={() => setSelectedVar("chlorophyll")}
              >
                🍃 Chlorophyll (mg/m³)
              </button>
            </div>
            <button className="center-btn" onClick={handleFlyTo}>
              🎯 Fly Camera to {currentRegion.name}
            </button>
          </div>

          {/* Graph Section */}
          <div className="graph-container">
            <div className="graph-title">
              <span>{currentRegion.name} — {varCfg.name} Profile vs Depth</span>
              <span className="source-tag">Copernicus Model vs Argovis In-Situ Data</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart layout="vertical" data={profileData} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  type="number"
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  unit={` ${varCfg.unit}`}
                  stroke="#a9b4c4"
                  fontSize={11}
                />
                <YAxis
                  dataKey="depth"
                  type="number"
                  reversed
                  domain={[0, 1000]}
                  ticks={[0, 100, 200, 500, 800, 1000]}
                  unit="m"
                  stroke="#a9b4c4"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14, 22, 36, 0.95)",
                    borderColor: "rgba(79, 209, 255, 0.4)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey={varCfg.modelKey}
                  name={`Numerical Model ${varCfg.name}`}
                  stroke={varCfg.modelColor}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={varCfg.obsKey}
                  name={`Observed Argo ${varCfg.name}`}
                  stroke={varCfg.obsColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Diagnostics Grid */}
          <div className="diagnostics-grid">
            <div className="diag-card">
              <span className="diag-label">Mixed Layer Depth (MLD)</span>
              <span className="diag-val">{diagnostics.mld}</span>
            </div>
            <div className="diag-card">
              <span className="diag-label">Thermocline Gradient</span>
              <span className="diag-val">{diagnostics.thermoclineGradient}</span>
            </div>
            <div className="diag-card">
              <span className="diag-label">Halocline / Barrier Layer</span>
              <span className="diag-val">{diagnostics.haloclineDepth}</span>
            </div>
            <div className="diag-card">
              <span className="diag-label">Oxygen Minimum Zone (OMZ)</span>
              <span className="diag-val">{diagnostics.omzDepth}</span>
            </div>
            <div className="diag-card">
              <span className="diag-label">Model Mean Bias</span>
              <span className="diag-val bias">{diagnostics.bias}</span>
            </div>
            <div className="diag-card">
              <span className="diag-label">Model RMSE Error</span>
              <span className="diag-val rmse">{diagnostics.rmse}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
