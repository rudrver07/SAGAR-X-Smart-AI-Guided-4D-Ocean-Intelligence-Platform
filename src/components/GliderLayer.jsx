import { useEffect, useState, Fragment } from "react";
import { Entity, useCesium } from "resium";
import { Cartesian3, Color, PolylineDashMaterialProperty, ScreenSpaceEventHandler, ScreenSpaceEventType, defined } from "cesium";
import { useOcean } from "../context/OceanContext";

const BACKEND_URL = "http://localhost:8000";

export default function GliderLayer() {
  const { viewer } = useCesium();
  const { layers, setSelectedPlatform, handleDataUpdated } = useOcean();
  const [gliders, setGliders] = useState([]);

  const isLayerActive = layers.glider;

  useEffect(() => {
    if (!isLayerActive) return;

    let isMounted = true;
    fetch(`${BACKEND_URL}/observations/glider`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setGliders(data.gliders || []);
        handleDataUpdated("glider", new Date());
      })
      .catch((err) => console.error("Failed to load glider data:", err));

    return () => { isMounted = false; };
  }, [isLayerActive, handleDataUpdated]);

  useEffect(() => {
    if (!viewer || !isLayerActive) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("glider-")) {
        const gliderId = picked.id.id.replace("glider-", "");
        const glider = gliders.find((g) => g.id === gliderId);
        if (glider) {
          setSelectedPlatform({
            ...glider,
            platformType: "GLIDER",
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, isLayerActive, gliders, setSelectedPlatform]);

  if (!isLayerActive) return null;

  return (
    <>
      {gliders.map((glider) => {
        const trajectoryPositions = glider.trajectory.flatMap((p) => [p.lon, p.lat]);

        return (
          <Fragment key={glider.id}>
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

            <Entity
              id={`glider-${glider.id}`}
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