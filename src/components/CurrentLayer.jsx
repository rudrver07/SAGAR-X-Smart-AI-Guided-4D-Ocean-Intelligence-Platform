import { useEffect, useState, useMemo } from "react";
import { Entity, useCesium } from "resium";
import {
  Cartesian3,
  Color,
  PolylineArrowMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
} from "cesium";
import { useOcean } from "../context/OceanContext";

const BACKEND_URL = "http://localhost:8000";

// Sleek ocean current color mapping (Navy -> Cyan -> Emerald -> Yellow -> Coral)
function getSpeedColor(speed, palette = "Thermal", opacity = 0.75) {
  const norm = Math.min(Math.max(speed / 1.2, 0.0), 1.0);

  if (palette === "Viridis") {
    const r = Math.round(norm * 250);
    const g = Math.round(norm * 230);
    const b = Math.round((1 - norm) * 200);
    return new Color(r / 255, g / 255, b / 255, opacity);
  } else {
    // Thermal/Default: Soft Cyan (slow) -> Bright Aqua -> Emerald Green -> Gold (fast)
    const h = (0.55 - norm * 0.45) * 360.0; // 200° (Cyan) down to 36° (Gold)
    return Color.fromHsl(h / 360, 0.95, 0.55, opacity);
  }
}

export default function CurrentLayer() {
  const { viewer } = useCesium();
  const { depth, currentTime, colorbar, layers, setSelectedVector, setOceanMetadata, handleDataUpdated, realtimeRefresh } = useOcean();

  const [vectors, setVectors] = useState([]);
  const isLayerActive = layers.current;

  useEffect(() => {
    if (!isLayerActive) return;

    let isMounted = true;
    const url = `${BACKEND_URL}/api/ocean/current?depth=${depth}&resolution=1.5${currentTime ? `&time_str=${currentTime}` : ""}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load ocean current field");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setVectors(data.vectors || []);

        if (data.metadata && setOceanMetadata) {
          setOceanMetadata({
            ...data.metadata,
            data_timestamp: data.timestamp,
            is_cached: data.cached,
            stale_fallback: data.stale_fallback,
            warning: data.warning,
          });
        }

        if (handleDataUpdated) {
          handleDataUpdated("current", new Date());
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching ocean currents:", err);
      });

    return () => { isMounted = false; };
  }, [depth, currentTime, isLayerActive, setOceanMetadata, handleDataUpdated, realtimeRefresh]);

  useEffect(() => {
    if (!viewer || !isLayerActive) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("vec-")) {
        const index = parseInt(picked.id.id.replace("vec-", ""), 10);
        const vectorData = vectors[index];
        if (vectorData) {
          setSelectedVector(vectorData);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, isLayerActive, vectors, setSelectedVector]);

function isLand(lat, lon) {
  if (lat < 0.0 || lat > 38.0 || lon < 50.0 || lon > 100.0) {
    return false;
  }
  if (lat >= 5.5 && lat <= 9.9 && lon >= 79.5 && lon <= 82.2) {
    return true;
  }
  if (lat >= 8.0 && lat <= 36.0) {
    let westCoast = 77.0 - (lat - 8.0) * 0.45;
    if (lat > 20.0) westCoast = 68.0;
    let eastCoast = 77.5 + (lat - 8.0) * 0.65;
    if (lat > 20.0) eastCoast = 89.0;
    if (lon >= westCoast && lon <= eastCoast) {
      if (lat >= 20.0 && lat <= 23.5 && lon < 72.5) {
        return false;
      }
      return true;
    }
  }
  if (lat >= 14.0 && lon <= 62.0) {
    return true;
  }
  if (lat >= 10.0 && lon >= 94.0) {
    return true;
  }
  return false;
}

  const arrowEntities = useMemo(() => {
    return vectors
      .filter((vec) => !isLand(vec.lat, vec.lon))
      .map((vec, idx) => {
        const arrowLength = Math.max(0.12, Math.min(vec.speed * 0.22, 0.35));
        const cosLat = Math.max(Math.cos((vec.lat * Math.PI) / 180), 0.2);
        const endLon = vec.lon + (vec.u * arrowLength) / (1.11 * cosLat);
        const endLat = vec.lat + (vec.v * arrowLength) / 1.11;

        if (isLand(endLat, endLon)) {
          return null;
        }

        const positions = Cartesian3.fromDegreesArray([
          vec.lon,
          vec.lat,
          endLon,
          endLat,
        ]);

        const vectorColor = getSpeedColor(
          vec.speed,
          colorbar?.palette || "Thermal",
          colorbar?.opacity || 0.75
        );

        return {
          id: `vec-${idx}`,
          positions,
          color: vectorColor,
          speed: vec.speed,
        };
      })
      .filter(Boolean);
  }, [vectors, colorbar]);

  if (!isLayerActive) return null;

  return (
    <>
      {arrowEntities.map((arr) => (
        <Entity
          key={arr.id}
          id={arr.id}
          polyline={{
            positions: arr.positions,
            width: Math.max(2, Math.min(Math.round(arr.speed * 3), 4)),
            material: new PolylineArrowMaterialProperty(arr.color),
          }}
        />
      ))}
    </>
  );
}
