import { useEffect, useState } from "react";
import { Entity, useCesium } from "resium";
import { Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType, defined } from "cesium";
import { useOcean } from "../context/OceanContext";

const BACKEND_URL = "http://localhost:8000";

export default function CTDLayer() {
  const { viewer } = useCesium();
  const { layers, setSelectedPlatform, handleDataUpdated } = useOcean();
  const [stations, setStations] = useState([]);

  const isLayerActive = layers.ctd;

  useEffect(() => {
    if (!isLayerActive) return;

    let isMounted = true;
    fetch(`${BACKEND_URL}/observations/ctd`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setStations(data.stations || []);
        handleDataUpdated("ctd", new Date());
      })
      .catch((err) => console.error("Failed to load CTD observations:", err));

    return () => { isMounted = false; };
  }, [isLayerActive, handleDataUpdated]);

  useEffect(() => {
    if (!viewer || !isLayerActive) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.id && picked.id.id.startsWith("ctd-")) {
        const stnId = picked.id.id.replace("ctd-", "");
        const station = stations.find((s) => s.platformId === stnId);
        if (station) {
          setSelectedPlatform({
            ...station,
            id: station.platformId,
            region: station.stationName,
            lat: station.latitude,
            lon: station.longitude,
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewer, isLayerActive, stations, setSelectedPlatform]);

  if (!isLayerActive) return null;

  return (
    <>
      {stations.map((stn) => (
        <Entity
          key={stn.platformId}
          id={`ctd-${stn.platformId}`}
          name={stn.stationName}
          position={Cartesian3.fromDegrees(stn.longitude, stn.latitude)}
          point={{
            pixelSize: 14,
            color: Color.PURPLE,
            outlineColor: Color.WHITE,
            outlineWidth: 2,
          }}
        />
      ))}
    </>
  );
}
