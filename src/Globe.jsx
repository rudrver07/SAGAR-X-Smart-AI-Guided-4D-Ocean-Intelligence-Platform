import { Viewer, ImageryLayer } from "resium";
import { Ion, WebMapTileServiceImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useState, useMemo } from "react";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function Globe() {
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
      </Viewer>
    </>
  );
}