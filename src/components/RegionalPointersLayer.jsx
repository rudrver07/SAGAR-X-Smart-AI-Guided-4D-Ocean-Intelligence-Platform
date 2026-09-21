/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { Entity, useCesium } from "resium";
import { Cartesian3, Cartesian2, Color, LabelStyle, ScreenSpaceEventHandler, ScreenSpaceEventType, defined } from "cesium";
import { useOcean } from "../context/OceanContext";

export const REGIONAL_ANALYSIS_POINTS = [
  { id: "arabian_sea", name: "Arabian Sea Analysis", shortName: "📍 Arabian Sea", lat: 15.5, lon: 65.0 },
  { id: "bay_of_bengal", name: "Bay of Bengal Analysis", shortName: "📍 Bay of Bengal", lat: 13.0, lon: 88.0 },
  { id: "indian_ocean", name: "Indian Ocean Analysis", shortName: "📍 Indian Ocean", lat: -4.0, lon: 76.0 },
  { id: "laccadive_sea", name: "Laccadive Sea Analysis", shortName: "📍 Laccadive Sea", lat: 9.5, lon: 73.0 },
  { id: "andaman_sea", name: "Andaman Sea Analysis", shortName: "📍 Andaman Sea", lat: 11.5, lon: 94.0 },
];

export default function RegionalPointersLayer({ onOpenAnalysis }) {
  const { viewer } = useCesium();
  const { layers } = useOcean();

  const isLayerActive = layers.regionalPointers !== false;

  useEffect(() => {
    if (!viewer || !isLayerActive || !onOpenAnalysis) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("pointer-")) {
        const regionId = picked.id.id.replace("pointer-", "");
        onOpenAnalysis(regionId);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, isLayerActive, onOpenAnalysis]);

  if (!isLayerActive) return null;

  return (
    <>
      {REGIONAL_ANALYSIS_POINTS.map((pt) => (
        <Entity
          key={pt.id}
          id={`pointer-${pt.id}`}
          name={pt.name}
          position={Cartesian3.fromDegrees(pt.lon, pt.lat)}
          point={{
            pixelSize: 16,
            color: Color.fromCssColorString("#ffb703"),
            outlineColor: Color.WHITE,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }}
          label={{
            text: `${pt.shortName} (Click for Graph)`,
            font: "bold 12px 'Segoe UI', sans-serif",
            fillColor: Color.fromCssColorString("#ffb703"),
            outlineColor: Color.fromCssColorString("#0b111e"),
            outlineWidth: 3,
            style: LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cartesian2(0, -22),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </>
  );
}
