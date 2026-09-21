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
  Math as CesiumMath,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useMemo, useEffect } from "react";
import { useOcean } from "./context/OceanContext";
import ArgoLayer from "./components/ArgoLayer";
import GliderLayer from "./components/GliderLayer";
import CTDLayer from "./components/CTDLayer";
import BGCLayer from "./components/BGCLayer";
import CurrentLayer from "./components/CurrentLayer";
import ModelFieldLayer from "./components/ModelFieldLayer";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const REGION_LABELS = [
  { id: "arabian_sea", name: "Arabian Sea 🌊", lat: 15.5, lon: 65.0 },
  { id: "bay_of_bengal", name: "Bay of Bengal 🌊", lat: 13.0, lon: 88.0 },
  { id: "indian_ocean", name: "Indian Ocean 🌊", lat: -4.0, lon: 76.0 },
  { id: "laccadive_sea", name: "Laccadive Sea 🏝️", lat: 9.5, lon: 73.0 },
  { id: "andaman_sea", name: "Andaman Sea 🌋", lat: 11.5, lon: 94.0 },
];

function RegionLabels({ onSelectRegion }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer || !onSelectRegion) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("region-")) {
        const regionId = picked.id.id.replace("region-", "");
        onSelectRegion(regionId);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, onSelectRegion]);

  return (
    <>
      {REGION_LABELS.map((r) => (
        <Entity
          key={r.id}
          id={`region-${r.id}`}
          position={Cartesian3.fromDegrees(r.lon, r.lat)}
          label={{
            text: r.name,
            font: "bold 13px 'Segoe UI', sans-serif",
            fillColor: Color.fromCssColorString("#7ee8fa"),
            outlineColor: Color.fromCssColorString("#0b111e"),
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

function ExaggerationController({ value }) {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;
    // eslint-disable-next-line react-hooks/immutability
    viewer.scene.verticalExaggeration = value;
  }, [viewer, value]);

  return null;
}

function CameraRegionController() {
  const { viewer } = useCesium();
  const { region } = useOcean();

  useEffect(() => {
    if (!viewer || !region) return;

    if (region.lat && region.lon) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(region.lon, region.lat, 1800000.0),
        duration: 2.0,
      });
    } else if (region.lat_min) {
      const centerLat = (region.lat_min + region.lat_max) / 2;
      const centerLon = (region.lon_min + region.lon_max) / 2;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(centerLon, centerLat, 2200000.0),
        duration: 2.0,
      });
    }
  }, [viewer, region]);

  return null;
}

function LocationInspectorHandler() {
  const { viewer } = useCesium();
  const { depth, setSelectedVector } = useOcean();

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id) {
        return;
      }

      const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        const lat = CesiumMath.toDegrees(cartographic.latitude);
        const lon = CesiumMath.toDegrees(cartographic.longitude);

        fetch(`http://localhost:8000/api/ocean/inspect?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}&depth=${depth}`)
          .then((res) => res.json())
          .then((data) => {
            if (setSelectedVector) {
              setSelectedVector(data);
            }
          })
          .catch((err) => console.error("Failed to inspect point current:", err));
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, depth, setSelectedVector]);

  return null;
}

function InitialCameraSetup() {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(78.0, 14.0, 4800000.0),
      duration: 1.5,
    });
  }, [viewer]);

  return null;
}

import RegionalPointersLayer from "./components/RegionalPointersLayer";

export default function Globe({ onSelectRegion, onOpenAnalysis }) {
  const { verticalExaggeration, layers } = useOcean();

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

  const showGibs = layers.satellite !== false;

  return (
    <Viewer
      full
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      geocoder={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      selectionIndicator={false}
      infoBox={false}
    >
      <InitialCameraSetup />
      {showGibs && <ImageryLayer imageryProvider={gibsProvider} alpha={1.0} />}
      
      {/* Model 2D Gridded Field Layer (Temperature, Salinity, Chlorophyll) */}
      <ModelFieldLayer />

      {/* Real-time Ocean Current Vectors Layer */}
      <CurrentLayer />

      {/* Observation Layers */}
      <ArgoLayer />
      <GliderLayer />
      <CTDLayer />
      <BGCLayer />

      {/* Regional Graph Analysis Pointers */}
      <RegionalPointersLayer onOpenAnalysis={onOpenAnalysis} />

      <LocationInspectorHandler />
      <ExaggerationController value={verticalExaggeration} />
      <CameraRegionController />
      <RegionLabels onSelectRegion={onSelectRegion} />
    </Viewer>
  );
}