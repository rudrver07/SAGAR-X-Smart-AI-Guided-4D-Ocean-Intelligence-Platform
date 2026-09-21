import { useEffect, useState, Fragment } from "react";
import { Entity, useCesium } from "resium";
import {
  Cartesian3,
  Color,
  PolylineDashMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
} from "cesium";

export default function GliderLayer({ onSelectGlider }) {
  const { viewer } = useCesium();
  const [gliders, setGliders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/observations/glider")
      .then((res) => res.json())
      .then((data) => setGliders(data.gliders || []))
      .catch((err) => console.error("Failed to load glider data:", err));
  }, []);

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id) {
        const glider = gliders.find((g) => g.id === picked.id.id);
        if (glider) onSelectGlider(glider);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, gliders, onSelectGlider]);

  return (
    <>
      {gliders.map((glider) => {
        const trajectoryPositions = glider.trajectory.flatMap((p) => [p.lon, p.lat]);

        return (
          <Fragment key={glider.id}>
            {/* Trajectory path — dashed amber line showing where the glider has traveled */}
            <Entity
              polyline={{
                positions: Cartesian3.fromDegreesArray(trajectoryPositions),
                width: 2,
                material: new PolylineDashMaterialProperty({
                  color: Color.ORANGE,
                  dashLength: 12,
                }),
                clampToGround: false,
              }}
            />

            {/* Current position marker — distinct orange point vs Argo's cyan */}
            <Entity
              id={glider.id}
              name={glider.id}
              position={Cartesian3.fromDegrees(glider.lon, glider.lat)}
              point={{
                pixelSize: 14,
                color: Color.ORANGE,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
              }}
            />
          </Fragment>
        );
      })}
    </>
  );
}