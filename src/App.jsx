import { useState } from "react";
import Globe from "./Globe";
import Controls from "./components/Controls";
import ProfilePanel from "./components/ProfilePanel";

export default function App() {
  const [variable, setVariable] = useState("temperature");
  const [depth, setDepth] = useState(0);
  const [colorbar, setColorbar] = useState({
    palette: "Thermal",
    min: 0,
    max: 30,
    opacity: 0.8,
    logScale: false,
  });
  const [verticalExaggeration, setVerticalExaggeration] = useState(1);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [lastUpdated, setLastUpdated] = useState({ argo: null, glider: null });

  const handleDataUpdated = (source, time) => {
    setLastUpdated((prev) => ({ ...prev, [source]: time }));
  };

  return (
    <>
      <Globe
        variable={variable}
        depth={depth}
        colorbar={colorbar}
        verticalExaggeration={verticalExaggeration}
        onSelectFloat={setSelectedInstrument}
        onSelectGlider={setSelectedInstrument}
        onDataUpdated={handleDataUpdated}
      />
      <Controls
        variable={variable}
        setVariable={setVariable}
        depth={depth}
        setDepth={setDepth}
        colorbar={colorbar}
        setColorbar={setColorbar}
        verticalExaggeration={verticalExaggeration}
        setVerticalExaggeration={setVerticalExaggeration}
        lastUpdated={lastUpdated}
      />
      <ProfilePanel float={selectedInstrument} onClose={() => setSelectedInstrument(null)} />
    </>
  );
}