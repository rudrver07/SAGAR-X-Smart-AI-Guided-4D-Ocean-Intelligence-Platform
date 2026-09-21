export const VARIABLE_DEFAULTS = {
  temperature: { name: "Temperature", units: "°C", min: 20, max: 32, palette: "Thermal" },
  salinity: { name: "Salinity", units: "PSU", min: 32, max: 37, palette: "Viridis" },
  chlorophyll: { name: "Chlorophyll", units: "mg/m³", min: 0.05, max: 2.5, palette: "Viridis" },
  current: { name: "Ocean Currents", units: "m/s", min: 0, max: 1.5, palette: "Thermal" },
};

export const DEPTH_LEVELS = [0, 10, 50, 100, 200, 500, 1000];
