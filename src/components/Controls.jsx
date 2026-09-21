import "./Controls.css";
import Dropdown from "./Dropdown";
import DataSourceBadge from "./DataSourceBadge";
import { useOcean } from "../context/OceanContext";
import { DEPTH_LEVELS } from "../constants/oceanConstants";

const PALETTES = ["Viridis", "Thermal", "Rainbow", "Grayscale"];
const VARIABLES = ["temperature", "salinity", "chlorophyll", "current"];

export default function Controls() {
  const {
    variable,
    setVariable,
    depth,
    setDepth,
    colorbar,
    setColorbar,
    verticalExaggeration,
    setVerticalExaggeration,
    lastUpdated,
    oceanMetadata,
  } = useOcean();

  return (
    <div className="sagarx-controls">
      <h3>SAGAR-X Controls</h3>

      <p className="sagarx-live-status">
        Argo: {lastUpdated.argo ? lastUpdated.argo.toLocaleTimeString() : "loading..."}
        {" · "}
        Glider: {lastUpdated.glider ? lastUpdated.glider.toLocaleTimeString() : "loading..."}
        {" · "}
        Currents: {lastUpdated.current ? lastUpdated.current.toLocaleTimeString() : "live"}
      </p>

      <div className="sagarx-field">
        <label>Variable</label>
        <Dropdown
          value={variable}
          options={VARIABLES}
          onChange={setVariable}
        />
      </div>

      <div className="sagarx-field">
        <label>
          Depth <span className="value">{depth} m</span>
        </label>
        <input
          type="range"
          min={0}
          max={DEPTH_LEVELS.length - 1}
          step={1}
          value={DEPTH_LEVELS.indexOf(depth) >= 0 ? DEPTH_LEVELS.indexOf(depth) : 0}
          onChange={(e) => setDepth(DEPTH_LEVELS[Number(e.target.value)])}
        />
      </div>

      <div className="sagarx-field">
        <label>
          Vertical Exaggeration <span className="value">{verticalExaggeration}x</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={verticalExaggeration}
          onChange={(e) => setVerticalExaggeration(Number(e.target.value))}
        />
      </div>

      <div className="sagarx-field">
        <label>Palette</label>
        <Dropdown
          value={colorbar.palette}
          options={PALETTES}
          onChange={(p) => setColorbar((c) => ({ ...c, palette: p }))}
        />
      </div>

      <div className="sagarx-field sagarx-row">
        <div>
          <label>Min</label>
          <input
            type="number"
            value={colorbar.min}
            onChange={(e) => setColorbar((c) => ({ ...c, min: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label>Max</label>
          <input
            type="number"
            value={colorbar.max}
            onChange={(e) => setColorbar((c) => ({ ...c, max: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="sagarx-field">
        <label>
          Opacity <span className="value">{colorbar.opacity.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={colorbar.opacity}
          onChange={(e) => setColorbar((c) => ({ ...c, opacity: Number(e.target.value) }))}
        />
      </div>

      <label className="sagarx-checkbox">
        <input
          type="checkbox"
          checked={colorbar.logScale}
          onChange={(e) => setColorbar((c) => ({ ...c, logScale: e.target.checked }))}
        />
        Log scale
      </label>

      <DataSourceBadge
        metadata={oceanMetadata}
        depth={depth}
        variable={variable}
      />
    </div>
  );
}