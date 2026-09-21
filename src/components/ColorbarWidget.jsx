import { useState } from "react";
import { useOcean } from "../context/OceanContext";
import { VARIABLE_DEFAULTS } from "../constants/oceanConstants";
import "./ColorbarWidget.css";

const PALETTE_GRADIENTS = {
  Thermal: "linear-gradient(to right, #001f5c, #00b4d8, #ffd166, #ef476f)",
  Viridis: "linear-gradient(to right, #440154, #31688e, #35b779, #fde725)",
  Rainbow: "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
  Grayscale: "linear-gradient(to right, #000000, #ffffff)",
};

export default function ColorbarWidget() {
  const { variable, depth, colorbar } = useOcean();
  const [showGuide, setShowGuide] = useState(false);
  const meta = VARIABLE_DEFAULTS[variable] || { name: variable, units: "" };

  const gradient = PALETTE_GRADIENTS[colorbar.palette] || PALETTE_GRADIENTS.Thermal;

  return (
    <div className="sagarx-colorbar-widget">
      <div className="sagarx-colorbar-title">
        <span>{meta.name}</span>
        <span className="unit">({meta.units})</span>
        <span className="depth-tag">@{depth}m</span>
        <button
          className="guide-toggle-btn"
          onClick={() => setShowGuide((v) => !v)}
          title="Show screen colors & function legend guide"
        >
          {showGuide ? "✕" : "ℹ️ Legend"}
        </button>
      </div>

      <div className="sagarx-colorbar-bar" style={{ background: gradient }} />

      <div className="sagarx-colorbar-ticks">
        <span>{colorbar.min}</span>
        <span>{((colorbar.min + colorbar.max) / 2).toFixed(1)}</span>
        <span>{colorbar.max}</span>
      </div>

      {/* Screen Colors & Function Explanation Guide */}
      {showGuide && (
        <div className="sagarx-screen-color-guide">
          <div className="guide-header">SCREEN COLORS & MAP LEGEND</div>

          <div className="guide-group">
            <span className="group-title">🌡️ Heatmap Gradient</span>
            <div className="guide-item">
              <span className="color-chip navy" />
              <span>Deep Navy / Teal: Low Value ({colorbar.min} {meta.units})</span>
            </div>
            <div className="guide-item">
              <span className="color-chip yellow" />
              <span>Yellow / Gold: Warm ({((colorbar.min + colorbar.max) / 2).toFixed(0)} {meta.units})</span>
            </div>
            <div className="guide-item">
              <span className="color-chip red" />
              <span>Coral Red: Surface Peak ({colorbar.max} {meta.units})</span>
            </div>
          </div>

          <div className="guide-group">
            <span className="group-title">🌊 Ocean Current Vectors</span>
            <div className="guide-item">
              <span className="color-chip cyan" />
              <span>Cyan: Slow Current (&lt; 0.3 m/s)</span>
            </div>
            <div className="guide-item">
              <span className="color-chip emerald" />
              <span>Emerald: Moderate Current (0.3 - 0.7 m/s)</span>
            </div>
            <div className="guide-item">
              <span className="color-chip gold" />
              <span>Gold: Fast Current (&gt; 0.7 m/s)</span>
            </div>
          </div>

          <div className="guide-group">
            <span className="group-title">📍 Map Markers & Pointers</span>
            <div className="guide-item">
              <span className="color-chip cyan-dot" />
              <span>Cyan Dot: Argo Profiling Float Array</span>
            </div>
            <div className="guide-item">
              <span className="color-chip orange-dot" />
              <span>Orange Dot: Autonomous Underwater Gliders</span>
            </div>
            <div className="guide-item">
              <span className="color-chip purple-dot" />
              <span>Purple Dot: CTD Hydrographic Station</span>
            </div>
            <div className="guide-item">
              <span className="color-chip lime-dot" />
              <span>Lime Dot: BGC Bio-Argo Array</span>
            </div>
            <div className="guide-item">
              <span className="color-chip gold-pin" />
              <span>Gold Pin Pointer: Regional Graph Analysis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

