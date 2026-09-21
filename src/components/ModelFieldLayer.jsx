import { useEffect, useState, useMemo } from "react";
import { ImageryLayer } from "resium";
import { SingleTileImageryProvider, Rectangle } from "cesium";
import { useOcean } from "../context/OceanContext";

const BACKEND_URL = "http://localhost:8000";

function isLand(lat, lon) {
  // Broad bounding box outside Indian region
  if (lat < 0.0 || lat > 38.0 || lon < 50.0 || lon > 100.0) {
    return false;
  }

  // Sri Lanka
  if (lat >= 5.8 && lat <= 9.9 && lon >= 79.6 && lon <= 82.2) {
    return true;
  }

  // Peninsular India (8°N - 20°N)
  if (lat >= 8.0 && lat <= 20.0) {
    const westCoast = 77.0 - (lat - 8.0) * 0.45;
    const eastCoast = 77.5 + (lat - 8.0) * 0.65;
    if (lon >= westCoast && lon <= eastCoast) {
      return true;
    }
  }

  // Central & Northern India / Pakistan / Bangladesh (20°N - 36°N)
  if (lat > 20.0 && lat <= 36.0) {
    const westCoast = 68.0 - (lat - 20.0) * 0.2;
    const eastCoast = 88.5 + (lat - 20.0) * 0.2;
    if (lon >= westCoast && lon <= eastCoast) {
      return true;
    }
  }

  // Arabian Peninsula / Oman / Iran (Northwest of Arabian Sea)
  if (lat >= 12.0 && lon <= 60.0) {
    return true;
  }

  // Southeast Asia / Myanmar / Thailand (East of Bay of Bengal)
  if (lat >= 10.0 && lon >= 94.5) {
    return true;
  }

  return false;
}

function samplePalette(norm, paletteName) {
  const t = Math.min(Math.max(norm, 0.0), 1.0);

  if (paletteName === "Viridis") {
    const r = Math.round(68 + t * (253 - 68));
    const g = Math.round(1 + t * (231 - 1));
    const b = Math.round(84 + (1 - t) * (150 - 84));
    return [r, g, b, 235];
  } else if (paletteName === "Rainbow") {
    const h = (1.0 - t) * 240.0;
    const s = 1.0, l = 0.5;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r1 = 0, g1 = 0, b1 = 0;
    if (h < 60) { r1 = c; g1 = x; }
    else if (h < 120) { r1 = x; g1 = c; }
    else if (h < 180) { g1 = c; b1 = x; }
    else if (h < 240) { g1 = x; b1 = c; }
    return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255), 235];
  } else if (paletteName === "Grayscale") {
    const v = Math.round(t * 255);
    return [v, v, v, 235];
  } else {
    if (t < 0.33) {
      const p = t / 0.33;
      return [Math.round(20 * (1 - p)), Math.round(100 + 155 * p), 230, 235];
    } else if (t < 0.66) {
      const p = (t - 0.33) / 0.33;
      return [Math.round(255 * p), 235, Math.round(230 * (1 - p)), 235];
    } else {
      const p = (t - 0.66) / 0.34;
      return [240, Math.round(235 * (1 - p)), 30, 235];
    }
  }
}

export default function ModelFieldLayer() {
  const { variable, depth, currentTime, layers, colorbar, handleDataUpdated, realtimeRefresh } = useOcean();
  const [fieldData, setFieldData] = useState(null);
  const [imageryProvider, setImageryProvider] = useState(null);

  const isLayerActive = layers.modelField && variable !== "current";

  useEffect(() => {
    if (!isLayerActive) return;

    let isMounted = true;
    const url = `${BACKEND_URL}/api/model/data?variable=${variable}&depth=${depth}&time=${currentTime || ""}&resolution=0.25`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setFieldData(data);
        handleDataUpdated("model", new Date());
      })
      .catch((err) => console.error("Failed to load model grid:", err));

    return () => { isMounted = false; };
  }, [variable, depth, currentTime, isLayerActive, handleDataUpdated, realtimeRefresh]);

  const tileUrl = useMemo(() => {
    if (!isLayerActive || !fieldData || !fieldData.data || fieldData.data.length === 0) {
      return null;
    }

    const { dimensions, data } = fieldData;
    const width = dimensions.lon_count;
    const height = dimensions.lat_count;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(width, height);

    const minVal = colorbar.min;
    const maxVal = colorbar.max;
    const range = Math.max(maxVal - minVal, 0.001);

    for (let r = 0; r < height; r++) {
      const latIdx = height - 1 - r;
      for (let c = 0; c < width; c++) {
        const itemIdx = latIdx * width + c;
        const item = data[itemIdx];
        const val = item ? item.value : minVal;
        const pxLat = item ? item.lat : 0;
        const pxLon = item ? item.lon : 0;

        const pxIdx = (r * width + c) * 4;

        if (isLand(pxLat, pxLon)) {
          // Transparent for landmass
          imgData.data[pxIdx] = 0;
          imgData.data[pxIdx + 1] = 0;
          imgData.data[pxIdx + 2] = 0;
          imgData.data[pxIdx + 3] = 0;
        } else {
          const norm = (val - minVal) / range;
          const [red, green, blue, alpha] = samplePalette(norm, colorbar.palette);
          imgData.data[pxIdx] = red;
          imgData.data[pxIdx + 1] = green;
          imgData.data[pxIdx + 2] = blue;
          imgData.data[pxIdx + 3] = alpha;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  }, [fieldData, colorbar.min, colorbar.max, colorbar.palette, isLayerActive]);

  useEffect(() => {
    if (!isLayerActive || !tileUrl || !fieldData) {
      return;
    }
    const { bbox } = fieldData;
    let isMounted = true;

    SingleTileImageryProvider.fromUrl(tileUrl, {
      rectangle: Rectangle.fromDegrees(bbox.lon_min, bbox.lat_min, bbox.lon_max, bbox.lat_max),
    })
      .then((provider) => {
        if (isMounted) setImageryProvider(provider);
      })
      .catch((err) => console.error("SingleTileImageryProvider error:", err));

    return () => { isMounted = false; };
  }, [tileUrl, fieldData, isLayerActive]);

  if (!isLayerActive || !imageryProvider) {
    return null;
  }

  return (
    <ImageryLayer
      imageryProvider={imageryProvider}
      alpha={colorbar.opacity}
    />
  );
}
