export const OCEAN_REGIONS_INFO = [
  {
    id: "arabian_sea",
    name: "Arabian Sea",
    lat: 15.5,
    lon: 65.0,
    area: "3,862,000 km²",
    maxDepth: "4,652 m",
    avgDepth: "2,734 m",
    salinityRange: "35.5 - 36.8 PSU",
    tempRange: "24.0°C - 30.5°C",
    keyCurrents: "West India Coastal Current (WICC), Somali Current",
    badge: "High Salinity & Upwelling",
    summary:
      "The northwestern region of the Indian Ocean, characterized by high evaporation exceeding precipitation, intense monsoonal wind forcing, and deep oxygen minimum zones (OMZ).",
    keyFacts: [
      "High Sea Surface Salinity (>36.0 PSU) due to dry continental wind evaporation.",
      "Strong summer Southwest Monsoon creates coastal upwelling off Oman, Somalia, and Kerala.",
      "Extensive Oxygen Minimum Zone (OMZ) between 200m and 1000m depth.",
      "Seasonal current reversal: Southward WICC in summer, Northward WICC in winter."
    ],
    inSituAssets: "48+ Argo floats, deep hydrographic CTD lines, and autonomous gliders."
  },
  {
    id: "bay_of_bengal",
    name: "Bay of Bengal",
    lat: 14.0,
    lon: 88.0,
    area: "2,172,000 km²",
    maxDepth: "4,694 m",
    avgDepth: "2,600 m",
    salinityRange: "30.0 - 34.5 PSU",
    tempRange: "27.0°C - 31.5°C",
    keyCurrents: "East India Coastal Current (EICC), South Monsoon Current",
    badge: "Low Salinity & Cyclonox",
    summary:
      "The northeastern arm of the Indian Ocean receiving heavy freshwater runoff from major river systems (Ganges, Brahmaputra, Irrawaddy), creating strong vertical salinity stratification.",
    keyFacts: [
      "Low Sea Surface Salinity (<33.0 PSU) due to heavy river discharge and monsoon rainfall.",
      "Strong vertical salinity stratification forms a shallow barrier layer trapping heat.",
      "Frequent genesis region for severe tropical cyclones during pre- and post-monsoon seasons.",
      "Warmer Sea Surface Temperatures (>28.5°C) supporting intense atmospheric convection."
    ],
    inSituAssets: "BGC Bio-Argo array, NIOT deep-sea moored buoys, and Glider survey lines."
  },
  {
    id: "indian_ocean",
    name: "Indian Ocean (Equatorial)",
    lat: -2.0,
    lon: 77.0,
    area: "70,560,000 km²",
    maxDepth: "7,290 m (Sunda Trench)",
    avgDepth: "3,741 m",
    salinityRange: "34.2 - 35.5 PSU",
    tempRange: "26.0°C - 29.5°C",
    keyCurrents: "South Equatorial Current, Equatorial Countercurrent, Wyrtki Jets",
    badge: "Climate Driver & IOD",
    summary:
      "The third-largest ocean globally, driving the Indian Ocean Dipole (IOD) climate phenomenon and regulating monsoon patterns across Asia and East Africa.",
    keyFacts: [
      "Semiannual eastward equatorial Wyrtki Jets carrying warm surface water during monsoon transitions.",
      "Indian Ocean Dipole (IOD) mode dictates sea surface temperature anomalies between east & west.",
      "Deep thermohaline overturning circulation with Antarctic Bottom Water exchange.",
      "Vital global maritime trade corridor connecting the Strait of Malacca and Suez Canal."
    ],
    inSituAssets: "Global Argo Float Array (120+ active floats), RAMA mooring network."
  },
  {
    id: "laccadive_sea",
    name: "Laccadive Sea (Lakshadweep)",
    lat: 9.5,
    lon: 73.5,
    area: "786,000 km²",
    maxDepth: "2,414 m",
    avgDepth: "1,929 m",
    salinityRange: "34.5 - 35.8 PSU",
    tempRange: "26.5°C - 30.0°C",
    keyCurrents: "Laccadive High / Low Eddies, Southern WICC limb",
    badge: "Coral Atolls & Eddies",
    summary:
      "Tropical sea body bordering southwestern India, Lakshadweep coral atolls, and the Maldives, featuring mesoscale ocean eddies and rich marine biodiversity.",
    keyFacts: [
      "Encompasses 36 coral islands/atolls of Lakshadweep and Chagos-Laccadive Ridge.",
      "Seasonal formation of the 'Laccadive High' anticyclonic eddy during winter.",
      "Warm, oligotrophic tropical waters with high coral reef biodiversity.",
      "Important nursery area for skipjack tuna and pelagic marine species."
    ],
    inSituAssets: "Lakshadweep coral monitoring buoys, CTD hydrographic stations, coastal gliders."
  },
  {
    id: "andaman_sea",
    name: "Andaman Sea",
    lat: 11.5,
    lon: 94.0,
    area: "797,700 km²",
    maxDepth: "4,180 m",
    avgDepth: "1,096 m",
    salinityRange: "31.5 - 33.8 PSU",
    tempRange: "27.5°C - 30.5°C",
    keyCurrents: "Andaman Sea Gyre, Malacca Strait Inflow",
    badge: "Internal Waves & Tectonics",
    summary:
      "A marginal sea in the northeastern Indian Ocean bounded by the Andaman & Nicobar island arc, famous for giant sub-surface internal ocean waves and tectonic activity.",
    keyFacts: [
      "Generates massive sub-surface internal solitons/waves propagating westward into Bay of Bengal.",
      "Active tectonic trench and back-arc spreading center with hydrothermal vents.",
      "Complex bathymetry with Andaman Basin dropping deeper than 4,000 meters.",
      "High biodiversity in mangrove estuaries, seagrass beds, and coral reefs."
    ],
    inSituAssets: "INCOIS Tsunami Buoy Network, Andaman sea surface current radars, Bio-Argo floats."
  }
];
