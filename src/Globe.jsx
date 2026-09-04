import { Viewer, ImageryLayer, Entity, useCesium } from "resium";
import {
  Ion,
  WebMapTileServiceImageryProvider,
  Cartesian3,
  Cartesian2,
  Color,
  LabelStyle,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useState, useMemo, useEffect } from "react";
import { DEMO_ARGO_FLOATS } from "./data/demoArgoFloats";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const VARIABLE_UNITS = {
  temperature: "°C",
  salinity: "PSU",
  chlorophyll: "mg/m³",
  current: "m/s",
};

// Small side-effect-only component: applies vertical exaggeration to the
// Cesium scene. Must live INSIDE <Viewer> to use useCesium(). Renders nothing.
function ExaggerationController({ value }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;
    viewer.scene.verticalExaggeration = value;
  }, [viewer, value]);

  return null;
}
const REGION_LABELS = [
  { name: "Arabian Sea", lat: 15.5, lon: 65.0 },
  { name: "Bay of Bengal", lat: 13.0, lon: 88.0 },
  { name: "Indian Ocean", lat: -5.0, lon: 75.0 },
  { name: "Laccadive Sea", lat: 10.0, lon: 73.0 },
];

function RegionLabels() {
  return (
    <>
      {REGION_LABELS.map((r) => (
        <Entity
          key={r.name}
          position={Cartesian3.fromDegrees(r.lon, r.lat)}
          label={{
            text: r.name,
            font: "14px Segoe UI, sans-serif",
            fillColor: Color.fromCssColorString("#a9d6ff"),
            outlineColor: Color.BLACK,
            outlineWidth: 3,
            style: LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cartesian2(0, -14),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </>
  );
}
// Plots demo Argo floats as clickable points on the globe.
// Must also live INSIDE <Viewer> to use useCesium().
function ArgoLayer({ onSelectFloat }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id) {
        const float = DEMO_ARGO_FLOATS.find((f) => f.id === picked.id.id);
        if (float) onSelectFloat(float);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, onSelectFloat]);

  return (
    <>
      {DEMO_ARGO_FLOATS.map((float) => (
        <Entity
          key={float.id}
          id={float.id}
          name={float.id}
          position={Cartesian3.fromDegrees(float.lon, float.lat)}
          point={{
            pixelSize: 12,
            color: Color.CYAN,
            outlineColor: Color.WHITE,
            outlineWidth: 2,
          }}
        />
      ))}
    </>
  );
}

export default function Globe({
  variable,
  depth,
  colorbar,
  verticalExaggeration,
  onSelectFloat,
}) {
  const gibsProvider = useMemo(() => {
    return new WebMapTileServiceImageryProvider({
      url:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/" +
        "MODIS_Terra_CorrectedReflectance_TrueColor/default/" +
        "{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg",
      layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "250m",
      maximumLevel: 8,
      credit: "NASA EOSDIS GIBS",
    });
  }, []);

  const [showGibs, setShowGibs] = useState(true);

  // Placeholder — will drive real data-layer rendering once the
  // FastAPI backend (or demo data) is wired in for later phases.
  console.log(
    `Active layer request → variable: ${variable} | depth: ${depth}m | ` +
    `color range: ${colorbar.min}${VARIABLE_UNITS[variable]} to ${colorbar.max}${VARIABLE_UNITS[variable]} | ` +
    `palette: ${colorbar.palette} | opacity: ${colorbar.opacity} | log scale: ${colorbar.logScale} | ` +
    `vertical exaggeration: ${verticalExaggeration}x`
  );

  return (
    <>
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 999,
          padding: "8px 12px",
          cursor: "pointer",
        }}
        onClick={() => setShowGibs((v) => !v)}
      >
        {showGibs ? "Hide" : "Show"} Satellite Layer
      </button>

      <Viewer
        full
        timeline={true}
        animation={true}
        baseLayerPicker={false}
        geocoder={false}
        sceneModePicker={false}
        navigationHelpButton={false}
      >
        {showGibs && <ImageryLayer imageryProvider={gibsProvider} alpha={1.0} />}
        <ArgoLayer onSelectFloat={onSelectFloat} />
        <ExaggerationController value={verticalExaggeration} />
        <RegionLabels />
      </Viewer>
    </>
  );
}