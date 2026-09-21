import { useContext } from "react";
import { OceanContext } from "./OceanContext";

export function useOcean() {
  const context = useContext(OceanContext);
  if (!context) {
    throw new Error("useOcean must be used within an OceanProvider");
  }
  return context;
}
