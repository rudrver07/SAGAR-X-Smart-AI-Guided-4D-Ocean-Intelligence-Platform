import { useState } from "react";
import Globe from "./Globe";
import Controls from "./components/Controls";

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

  return (
    <>
      <Globe variable={variable} depth={depth} colorbar={colorbar} />
      <Controls
        variable={variable}
        setVariable={setVariable}
        depth={depth}
        setDepth={setDepth}
        colorbar={colorbar}
        setColorbar={setColorbar}
      />
    </>
  );
}