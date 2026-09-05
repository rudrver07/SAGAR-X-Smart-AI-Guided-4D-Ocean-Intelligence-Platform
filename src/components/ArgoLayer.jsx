import { useEffect, useState } from "react";
import { Entity, useCesium } from "resium";
import {
  Cartesian3,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
} from "cesium";

export default function ArgoLayer({ onSelectFloat, onDataUpdated }) {
  const { viewer } = useCesium();
  const [floats, setFloats] = useState([]);

  // Fetch real Argo float data from the backend, then keep polling
  // every 5 minutes so the globe reflects live/updated data without
  // needing a manual page reload.
  useEffect(() => {
    const fetchFloats = () => {
      fetch("http://localhost:8000/observations/argo")
        .then((res) => res.json())
        .then((data) => {
          setFloats(data.floats || []);
          if (onDataUpdated) onDataUpdated("argo", new Date());
        })
        .catch((err) => console.error("Failed to load Argo data:", err));
    };

    fetchFloats(); // initial load on mount

    const interval = setInterval(fetchFloats, 5 * 60 * 1000); // re-poll every 5 min

    return () => clearInterval(interval); // cleanup: avoid stacking timers
  }, [onDataUpdated]);

  // Set up click detection on the globe. Re-runs whenever `floats`
  // changes so the click handler always has the latest data to search.
  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id) {
        const float = floats.find((f) => f.id === picked.id.id);
        if (float) onSelectFloat(float);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, floats, onSelectFloat]);

  return (
    <>
      {floats.map((float) => (
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