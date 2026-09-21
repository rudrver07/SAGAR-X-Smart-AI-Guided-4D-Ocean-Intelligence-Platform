import { useOcean } from "../context/OceanContext";
import "./LayerManagerPanel.css";

export default function LayerManagerPanel({ onOpenOceanInfo, onOpenAnalysis }) {
  const { layers, toggleLayer } = useOcean();

  return (
    <div className="sagarx-layer-manager">
      <div className="sagarx-layer-header">
        <span className="icon">🌊</span>
        <h3>DATA LAYERS</h3>
      </div>

      <div className="sagarx-layer-section">
        <div className="section-title">NUMERICAL MODEL OUTPUTS</div>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.satellite !== false}
            onChange={() => toggleLayer("satellite")}
          />
          <span className="indicator satellite-dot" />
          <span>MODIS Satellite Base</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.modelField}
            onChange={() => toggleLayer("modelField")}
          />
          <span className="indicator model-dot" />
          <span>Spatial Model Field</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.current}
            onChange={() => toggleLayer("current")}
          />
          <span className="indicator current-dot" />
          <span>Current Flow Field</span>
        </label>
      </div>

      <div className="sagarx-layer-section">
        <div className="section-title">IN-SITU OBSERVATIONS & POINTERS</div>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.regionalPointers !== false}
            onChange={() => toggleLayer("regionalPointers")}
          />
          <span className="indicator pointer-dot" />
          <span>Regional Graph Pointers</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.argo}
            onChange={() => toggleLayer("argo")}
          />
          <span className="indicator argo-dot" />
          <span>Argo Float Array</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.glider}
            onChange={() => toggleLayer("glider")}
          />
          <span className="indicator glider-dot" />
          <span>Autonomous Gliders</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.ctd}
            onChange={() => toggleLayer("ctd")}
          />
          <span className="indicator ctd-dot" />
          <span>CTD Hydrographic Stations</span>
        </label>
        <label className="sagarx-layer-item">
          <input
            type="checkbox"
            checked={layers.bgc}
            onChange={() => toggleLayer("bgc")}
          />
          <span className="indicator bgc-dot" />
          <span>BGC Bio-Argo Array</span>
        </label>
      </div>

      <div className="layer-button-group">
        {onOpenAnalysis && (
          <button
            className="layer-analysis-btn"
            onClick={() => onOpenAnalysis("arabian_sea")}
          >
            📊 Graph Analysis
          </button>
        )}
        {onOpenOceanInfo && (
          <button
            className="layer-ocean-info-btn"
            onClick={() => onOpenOceanInfo("arabian_sea")}
          >
            📖 Regional Info
          </button>
        )}
      </div>
    </div>
  );
}
