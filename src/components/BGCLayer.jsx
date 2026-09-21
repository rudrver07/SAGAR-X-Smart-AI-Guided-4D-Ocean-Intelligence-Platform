import { useEffect, useState } from "react";
import { Entity, useCesium } from "resium";
import { Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType, defined } from "cesium";
import { useOcean } from "../context/OceanContext";

const BACKEND_URL = "http://localhost:8000";

export default function BGCLayer() {
  const { viewer } = useCesium();
  const { layers, setSelectedPlatform, handleDataUpdated } = useOcean();
  const [floats, setFloats] = useState([]);

  const isLayerActive = layers.bgc;

  useEffect(() => {
    if (!isLayerActive) return;

    let isMounted = true;
    fetch(`${BACKEND_URL}/observations/bgc`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setFloats(data.floats || []);
        handleDataUpdated("bgc", new Date());
      })
      .catch((err) => console.error("Failed to load BGC observations:", err));

    return () => { isMounted = false; };
  }, [isLayerActive, handleDataUpdated]);

  useEffect(() => {
    if (!viewer || !isLayerActive) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("bgc-")) {
        const floatId = picked.id.id.replace("bgc-", "");
        const float = floats.find((f) => f.platformId === floatId);
        if (float) {
          setSelectedPlatform({
            ...float,
            id: float.platformId,
            region: `BGC Float (${float.platformId})`,
            lat: float.latitude,
            lon: float.longitude,
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, isLayerActive, floats, setSelectedPlatform]);

  if (!isLayerActive) return null;

  return (
    <>
      {floats.map((f) => (
        <Entity
          key={f.platformId}
          id={`bgc-${f.platformId}`}
          name={f.platformId}
          position={Cartesian3.fromDegrees(f.longitude, f.latitude)}
          point={{
            pixelSize: 13,
            color: Color.LIME,
            outlineColor: Color.WHITE,
            outlineWidth: 2,
          }}
        />
      ))}
    </>
  );
}
