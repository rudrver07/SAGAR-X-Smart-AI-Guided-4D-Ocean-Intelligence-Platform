import { useState } from "react";
import { OceanProvider } from "./context/OceanContext";
import Globe from "./Globe";
import Controls from "./components/Controls";
import LayerManagerPanel from "./components/LayerManagerPanel";
import ColorbarWidget from "./components/ColorbarWidget";
import TimelineControls from "./components/TimelineControls";
import AIAssistantPanel from "./components/AIAssistantPanel";
import ProfilePanel from "./components/ProfilePanel";
import OceanInfoPanel from "./components/OceanInfoPanel";
import RegionalAnalysisModal from "./components/RegionalAnalysisModal";
import "./App.css";

function HeaderBar({ onOpenOceanInfo, onOpenAnalysis }) {
  return (
    <header className="sagarx-header">
      <div className="sagarx-header-brand">
        <span className="logo">🌊</span>
        <span className="title">SAGAR-X</span>
        <span className="subtitle">3D Ocean Data Visualization & AI Analysis Platform</span>
      </div>
      <div className="sagarx-header-status">
        <button className="analysis-header-btn" onClick={() => onOpenAnalysis("arabian_sea")}>
          📊 Regional Graph Analysis
        </button>
        <button className="ocean-info-header-btn" onClick={() => onOpenOceanInfo("arabian_sea")}>
          📖 Oceans Around India
        </button>
        <span className="live-pill">
          <span className="pulse" /> REALTIME SYNC (30s)
        </span>
        <span className="region-pill">Indian Ocean EEZ</span>
      </div>
    </header>
  );
}

export default function App() {
  const [isOceanInfoOpen, setIsOceanInfoOpen] = useState(false);
  const [selectedOceanRegion, setSelectedOceanRegion] = useState("arabian_sea");

  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisRegionId, setAnalysisRegionId] = useState("arabian_sea");

  const handleOpenOceanInfo = (regionId = "arabian_sea") => {
    setSelectedOceanRegion(regionId);
    setIsOceanInfoOpen(true);
  };

  const handleOpenAnalysis = (regionId = "arabian_sea") => {
    setAnalysisRegionId(regionId);
    setIsAnalysisOpen(true);
  };

  return (
    <OceanProvider>
      <div className="sagarx-app">
        <HeaderBar onOpenOceanInfo={handleOpenOceanInfo} onOpenAnalysis={handleOpenAnalysis} />
        <Globe onSelectRegion={handleOpenOceanInfo} onOpenAnalysis={handleOpenAnalysis} />
        <LayerManagerPanel onOpenOceanInfo={handleOpenOceanInfo} onOpenAnalysis={handleOpenAnalysis} />
        <Controls />
        <ColorbarWidget />
        <TimelineControls />
        <AIAssistantPanel />
        <ProfilePanel />
        <OceanInfoPanel
          isOpen={isOceanInfoOpen}
          onClose={() => setIsOceanInfoOpen(false)}
          defaultRegionId={selectedOceanRegion}
        />
        <RegionalAnalysisModal
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          defaultRegionId={analysisRegionId}
        />
      </div>
    </OceanProvider>
  );
}