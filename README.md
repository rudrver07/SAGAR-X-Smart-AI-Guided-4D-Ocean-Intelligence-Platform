# 🌊 SAGAR-X Frontend: 4D Ocean Data Visualization & AI Analysis Engine

> **Interactive 4D Oceanographic Digital Twin for the Indian Ocean Region**  
> Integrating real-time Argo profiling float networks, autonomous underwater glider tracks, CTD stations, BGC floats, 2D/3D ocean model heatmaps with dynamic time-series data evolution, ocean current velocity flow fields, NASA GIBS satellite imagery, 3D Regional Graph Analysis Pointers, and natural language AI visualization control.

---

## 🚀 Quick Start: How to Open & Run the Website

To run the complete SAGAR-X application, you need to start **both the Python FastAPI Backend** and the **React 19 + Vite Frontend**.

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x`) -> [Download Node.js](https://nodejs.org/)
- **Python**: `v3.10` or higher -> [Download Python](https://www.python.org/)
- **Browser**: Modern web browser with WebGL enabled (Chrome, Edge, Firefox, Safari).

---

### Step 1: Launch the Backend Server

Open Terminal / PowerShell and navigate to the project root:

```powershell
# Navigate to the root directory
cd "c:\Users\Asus\Desktop\SAGARX - 1"

# Activate the Python Virtual Environment (Windows PowerShell)
.\backend\venv\Scripts\Activate.ps1

# Launch the FastAPI Backend Server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

*Backend Health Check*: Open `http://127.0.0.1:8000/docs` in your browser to verify Swagger API documentation.

---

### Step 2: Launch the Frontend Web Application

Open a **new Terminal window** and navigate to `sagar-x-globe`:

```powershell
# Navigate to the frontend directory
cd "cd c:\Users\Asus\Desktop\SAGARX - 1\sagar-x-globe"

# Install Node dependencies (if not installed already)
npm install

# Start the Vite Development Server
npm run dev
```

---

### Step 3: Open in Browser

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🌟 Feature Guide & Component Breakdown

### 1. 🌐 Interactive 3D/4D Cesium Globe Engine (`Globe.jsx`)
- Built with CesiumJS & Resium, focused on the Indian Ocean ($78.0^\circ\text{E}, 14.0^\circ\text{N}$).
- Smooth camera navigation, vertical exaggeration controls (1x to 20x), and interactive spatial labels for Arabian Sea, Bay of Bengal, Indian Ocean, Laccadive Sea, and Andaman Sea.

### 2. 🌡️ Spatial Model Field Heatmaps (`ModelFieldLayer.jsx`)
- Renders 2D/3D surface and depth-slice spatial field heatmaps for Temperature (°C), Salinity (PSU), and Chlorophyll ($mg/m^3$) using GPU-accelerated canvas textures mapped to `SingleTileImageryProvider`.
- **Dynamic Time Evolution**: Fully synchronized with `currentTime` state. Advancing the timeline slider or playing the animation fetches and calculates time-phase shifting model grids, physically evolving the ocean thermal and saline structure across time.
- Strict geographical coastline land masking (transparent alpha over landmasses for India, Sri Lanka, Oman, Pakistan, Bangladesh, and Myanmar).

### 3. 🌊 Ocean Current Velocity Field (`CurrentLayer.jsx`)
- Sleek, sparse ($1.5^\circ$) current flow field vector lines colored by speed gradient (Soft Cyan $\rightarrow$ Emerald $\rightarrow$ Yellow).
- **Time-Dependent Current Dynamics**: Velocity vector fields ($U, V$ components) dynamically adjust vectors and magnitude according to the active timeline timestamp.
- Point inspector calculating velocity components $U$, $V$, speed $\sqrt{U^2 + V^2}$, and compass direction $\text{atan2}(V, U)$.

### 4. 📍 3D Regional Graph Analysis Pointers (`RegionalPointersLayer.jsx`)
- Interactive golden pins on the 3D globe for Arabian Sea, Bay of Bengal, Indian Ocean, Laccadive Sea, and Andaman Sea.
- Clicking any pointer opens the **Regional Depth Profile Graph & Analysis Modal**.

### 5. 📊 Regional Depth Profile Graph Modal (`RegionalAnalysisModal.jsx`)
- Interactive Recharts depth line chart plotting water column curves from $0\text{m}$ down to $1000\text{m}$ for Temperature, Salinity, and Chlorophyll.
- Displays Mixed Layer Depth (MLD), Thermocline Gradient ($\text{^\circ C/m}$), Halocline Barrier Layer, Oxygen Minimum Zone (OMZ) core depth, and Model Mean Bias / RMSE statistics.

### 6. 📖 Oceans Around India Regional Information System (`OceanInfoPanel.jsx`)
- Modal card displaying surface area, max depth, salinity ranges, primary circulation currents (WICC, EICC, Somali Current, Wyrtki Jets), and active observation assets for all ocean bodies around India.

### 7. 🎨 Colorbar Legend & Screen Color Guide (`ColorbarWidget.jsx`)
- Live color scale legend supporting Viridis, Thermal, Rainbow, and Grayscale palettes.
- Interactive **`ℹ️ Legend`** drawer explaining all heatmap gradients, current vector speeds, and observation marker dot colors.

### 8. 📡 Live In-Situ Observation Layers
- **Argo Float Array** (`ArgoLayer.jsx` - Live Argovis REST API streaming)
- **Autonomous Gliders** (`GliderLayer.jsx` - Orange markers + dashed trajectory polylines)
- **CTD Hydrographic Stations** (`CTDLayer.jsx` - Purple deep survey markers)
- **BGC Bio-Argo Array** (`BGCLayer.jsx` - Lime biogeochemical profiling floats)

### 9. 🤖 Natural Language AI Ocean Assistant (`AIAssistantPanel.jsx`)
- Accepts natural language commands (e.g. *"Show temperature at 200 meters in Arabian Sea"*, *"Animate ocean currents"*, *"Show salinity at 500m"*).
- Emits whitelisted, structured tool actions (`select_variable`, `set_depth`, `set_region`, `show_layer`, `play_animation`, `set_vertical_exaggeration`) that directly control application state.

### 10. ⏱️ Time-Step Animation & Timeline Bar (`TimelineControls.jsx`)
- Bottom timeline slider, UTC timestamp badge, play/pause loop controls, and animation speed selector ($1x$, $2x$, $4x$).
- Real-time background ticker automatically syncing model field heatmaps and current vector grids with active timeline timestamps and 30-second live auto-refresh cycles.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 19, Vite
- **3D Geospatial Engine**: CesiumJS (`cesium`), Resium (`resium`), `vite-plugin-cesium`
- **Data Visualization**: Recharts (`recharts`)
- **State Management**: Centralized React Context (`OceanContext`) with 30-second live auto-refresh ticker
- **Styling**: Modern CSS with glassmorphism panels & theme variables
- **Backend API**: Python FastAPI (`uvicorn`, `httpx`, `numpy`, `scipy`, `netcdf4`)

---

## 🔧 Troubleshooting & Tips

- **PowerShell Script Execution Error**: If activating Python venv fails in PowerShell, run:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- **Port Busy**: If backend port `8000` or frontend port `5173` is already in use, you can specify custom ports during startup.

---

<p align="center">
  <b>SAGAR-X Ocean Intelligence Platform</b> • Frontend Documentation
</p>
