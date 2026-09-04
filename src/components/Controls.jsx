import "./Controls.css";
import Dropdown from "./Dropdown";

const DEPTH_LEVELS = [0, 100, 200, 500, 1000];
const PALETTES = ["Viridis", "Thermal", "Rainbow", "Grayscale"];
const VARIABLES = ["temperature", "salinity", "chlorophyll", "current"];

export default function Controls({
  depth,
  setDepth,
  colorbar,
  setColorbar,
  variable,
  setVariable,
  verticalExaggeration,
  setVerticalExaggeration,
}) {
  return (
    <div className="sagarx-controls">
      <h3>SAGAR-X Controls</h3>

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
          value={DEPTH_LEVELS.indexOf(depth)}
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
    </div>
  );
}