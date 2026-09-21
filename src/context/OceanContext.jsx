/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { VARIABLE_DEFAULTS } from "../constants/oceanConstants";

export const OceanContext = createContext(null);

export function OceanProvider({ children }) {
  const [variable, setVariableState] = useState("temperature");
  const [depth, setDepth] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);
  const [timeSteps, setTimeSteps] = useState([new Date().toISOString()]);
  const [region, setRegion] = useState(null);
  
  const [layers, setLayers] = useState({
    modelField: true,
    current: false,
    argo: true,
    glider: true,
    ctd: false,
    bgc: false,
  });

  const [colorbar, setColorbarState] = useState({
    palette: "Thermal",
    min: 20,
    max: 32,
    opacity: 0.70,
    logScale: false,
    autoRange: true,
  });

  const [verticalExaggeration, setVerticalExaggeration] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedVector, setSelectedVector] = useState(null);
  
  const [animation, setAnimation] = useState({
    isPlaying: false,
    speed: 1500,
  });

  const [oceanMetadata, setOceanMetadata] = useState(null);
  const [lastUpdated, setLastUpdated] = useState({ argo: null, glider: null, ctd: null, bgc: null, current: null, model: null });
  const [realtimeRefresh, setRealtimeRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/times")
      .then((res) => res.json())
      .then((times) => {
        if (Array.isArray(times) && times.length > 0) {
          setTimeSteps(times);
          setTimeIndex(times.length - 1);
        }
      })
      .catch(() => {});
  }, []);

  // Real-time automatic data refresh loop (polls every 30 seconds)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRealtimeRefresh((prev) => prev + 1);
      const now = new Date();
      setLastUpdated((prev) => ({
        ...prev,
        model: now,
        current: now,
        argo: now,
      }));
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const setVariable = useCallback((newVar) => {
    setVariableState(newVar);
    const defaults = VARIABLE_DEFAULTS[newVar];
    if (defaults) {
      setColorbarState((prev) => ({
        ...prev,
        min: defaults.min,
        max: defaults.max,
        palette: defaults.palette,
      }));
    }

    if (newVar === "current") {
      setLayers((prev) => ({ ...prev, current: true, modelField: false }));
    } else {
      setLayers((prev) => ({ ...prev, current: false, modelField: true }));
    }
  }, []);

  const toggleLayer = useCallback((layerKey) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  const setColorbar = useCallback((update) => {
    setColorbarState((prev) => (typeof update === "function" ? update(prev) : { ...prev, ...update }));
  }, []);

  const handleDataUpdated = useCallback((source, time = new Date()) => {
    setLastUpdated((prev) => ({ ...prev, [source]: time }));
  }, []);

  useEffect(() => {
    if (!animation.isPlaying || timeSteps.length <= 1) return;

    const timer = setInterval(() => {
      setTimeIndex((prev) => (prev + 1) % timeSteps.length);
    }, animation.speed);

    return () => clearInterval(timer);
  }, [animation.isPlaying, animation.speed, timeSteps]);

  const executeAITool = useCallback((toolName, args = {}) => {
    switch (toolName) {
      case "select_variable":
        if (args.variable) setVariable(args.variable);
        break;
      case "set_depth":
        if (typeof args.depth === "number") setDepth(args.depth);
        break;
      case "set_time":
        if (typeof args.timeIndex === "number") setTimeIndex(args.timeIndex);
        break;
      case "set_region":
        if (args.lat && args.lon) {
          setRegion({ lat: args.lat, lon: args.lon, name: args.name });
        }
        break;
      case "show_layer":
        if (args.layer) setLayers((prev) => ({ ...prev, [args.layer]: true }));
        break;
      case "hide_layer":
        if (args.layer) setLayers((prev) => ({ ...prev, [args.layer]: false }));
        break;
      case "set_opacity":
        if (typeof args.opacity === "number") {
          setColorbarState((prev) => ({ ...prev, opacity: args.opacity }));
        }
        break;
      case "set_color_range":
        if (typeof args.min === "number" && typeof args.max === "number") {
          setColorbarState((prev) => ({ ...prev, min: args.min, max: args.max }));
        }
        break;
      case "play_animation":
        setAnimation((prev) => ({ ...prev, isPlaying: true }));
        break;
      case "pause_animation":
        setAnimation((prev) => ({ ...prev, isPlaying: false }));
        break;
      case "set_vertical_exaggeration":
        if (typeof args.factor === "number") setVerticalExaggeration(args.factor);
        break;
      default:
        console.warn("Unknown AI tool:", toolName);
    }
  }, [setVariable]);

  const value = {
    variable,
    setVariable,
    depth,
    setDepth,
    timeIndex,
    setTimeIndex,
    timeSteps,
    currentTime: timeSteps[timeIndex] || null,
    region,
    setRegion,
    layers,
    setLayers,
    toggleLayer,
    colorbar,
    setColorbar,
    verticalExaggeration,
    setVerticalExaggeration,
    selectedPlatform,
    setSelectedPlatform,
    selectedVector,
    setSelectedVector,
    animation,
    setAnimation,
    oceanMetadata,
    setOceanMetadata,
    lastUpdated,
    handleDataUpdated,
    realtimeRefresh,
    executeAITool,
  };

  return <OceanContext.Provider value={value}>{children}</OceanContext.Provider>;
}

export { useOcean } from "./useOcean";
