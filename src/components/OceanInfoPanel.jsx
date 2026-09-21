import { useState } from "react";
import { OCEAN_REGIONS_INFO } from "../constants/oceanRegionInfo";
import { useOcean } from "../context/OceanContext";
import "./OceanInfoPanel.css";

export default function OceanInfoPanel({ isOpen, onClose, defaultRegionId }) {
  const { setRegion, setVariable, toggleLayer, setDepth } = useOcean();
  const [selectedId, setSelectedId] = useState(defaultRegionId || "arabian_sea");

  if (!isOpen) return null;

  const currentRegion =
    OCEAN_REGIONS_INFO.find((r) => r.id === selectedId) || OCEAN_REGIONS_INFO[0];

  const handleFlyTo = () => {
    setRegion({
      lat: currentRegion.lat,
      lon: currentRegion.lon,
      name: currentRegion.name,
    });
  };

  const handleShowTemperature = () => {
    setVariable("temperature");
    setDepth(0);
    handleFlyTo();
  };

  const handleShowSalinity = () => {
    setVariable("salinity");
    setDepth(0);
    handleFlyTo();
  };

  const handleShowCurrents = () => {
    toggleLayer("current");
    handleFlyTo();
  };

  return (
    <div className="sagarx-ocean-info-overlay">
      <div className="sagarx-ocean-info-modal">
        <div className="sagarx-ocean-info-header">
          <div className="header-title">
            <span className="icon">🌊</span>
            <div>
              <h2>Oceans Around India</h2>
              <span className="subtitle">Oceanographic Data & Basin Characteristics</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Region Selector Tabs */}
        <div className="sagarx-region-tabs">
          {OCEAN_REGIONS_INFO.map((reg) => (
            <button
              key={reg.id}
              className={`region-tab ${reg.id === selectedId ? "active" : ""}`}
              onClick={() => {
                setSelectedId(reg.id);
                setRegion({ lat: reg.lat, lon: reg.lon, name: reg.name });
              }}
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Selected Region Details */}
        <div className="sagarx-ocean-info-body">
          <div className="region-title-row">
            <h3>{currentRegion.name}</h3>
            <span className="badge">{currentRegion.badge}</span>
          </div>

          <p className="region-summary">{currentRegion.summary}</p>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Surface Area</span>
              <span className="metric-value">{currentRegion.area}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Max Depth</span>
              <span className="metric-value">{currentRegion.maxDepth}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Salinity Range</span>
              <span className="metric-value">{currentRegion.salinityRange}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Temp Range</span>
              <span className="metric-value">{currentRegion.tempRange}</span>
            </div>
          </div>

          {/* Key Currents & Features */}
          <div className="info-section">
            <h4>🌊 Primary Circulation & Currents</h4>
            <p className="currents-text">{currentRegion.keyCurrents}</p>
          </div>

          <div className="info-section">
            <h4>📌 Key Oceanographic Characteristics</h4>
            <ul className="facts-list">
              {currentRegion.keyFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h4>📡 Observational Assets</h4>
            <p className="assets-text">{currentRegion.inSituAssets}</p>
          </div>
        </div>

        {/* Modal Quick Action Footer */}
        <div className="sagarx-ocean-info-footer">
          <button className="action-btn fly-btn" onClick={handleFlyTo}>
            🎯 Center 3D Globe
          </button>
          <button className="action-btn temp-btn" onClick={handleShowTemperature}>
            🌡️ Show Temperature
          </button>
          <button className="action-btn sal-btn" onClick={handleShowSalinity}>
            🧂 Show Salinity
          </button>
          <button className="action-btn curr-btn" onClick={handleShowCurrents}>
            🌊 Toggle Currents
          </button>
        </div>
      </div>
    </div>
  );
}
