import { useOcean } from "../context/OceanContext";
import "./TimelineControls.css";

export default function TimelineControls() {
  const { timeIndex, setTimeIndex, timeSteps, currentTime, animation, setAnimation } = useOcean();

  if (!timeSteps || timeSteps.length === 0) return null;

  const togglePlay = () => {
    setAnimation((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handlePrev = () => {
    setTimeIndex((prev) => (prev > 0 ? prev - 1 : timeSteps.length - 1));
  };

  const handleNext = () => {
    setTimeIndex((prev) => (prev < timeSteps.length - 1 ? prev + 1 : 0));
  };

  const formatTime = (iso) => {
    if (!iso) return "LIVE";
    try {
      const d = new Date(iso);
      return d.toUTCString().replace("GMT", "UTC");
    } catch {
      return iso;
    }
  };

  return (
    <div className="sagarx-timeline-panel">
      <div className="sagarx-timeline-buttons">
        <button className="sagarx-timeline-btn" onClick={handlePrev} title="Previous Timestep">
          ⏮
        </button>
        <button
          className={`sagarx-timeline-btn play-btn ${animation.isPlaying ? "playing" : ""}`}
          onClick={togglePlay}
          title={animation.isPlaying ? "Pause Animation" : "Play Animation"}
        >
          {animation.isPlaying ? "❚❚" : "▶"}
        </button>
        <button className="sagarx-timeline-btn" onClick={handleNext} title="Next Timestep">
          ⏭
        </button>
      </div>

      <div className="sagarx-timeline-slider-container">
        <div className="sagarx-timeline-info">
          <span className="sagarx-time-badge">
            <span className="live-dot" /> {formatTime(currentTime)}
          </span>
          <span className="sagarx-step-count">
            Step {timeIndex + 1} / {timeSteps.length}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={timeSteps.length - 1}
          value={timeIndex}
          onChange={(e) => setTimeIndex(Number(e.target.value))}
          className="sagarx-timeline-slider"
        />
      </div>

      <div className="sagarx-speed-selector">
        <button
          className={animation.speed === 2000 ? "active" : ""}
          onClick={() => setAnimation((prev) => ({ ...prev, speed: 2000 }))}
        >
          1x
        </button>
        <button
          className={animation.speed === 1000 ? "active" : ""}
          onClick={() => setAnimation((prev) => ({ ...prev, speed: 1000 }))}
        >
          2x
        </button>
        <button
          className={animation.speed === 500 ? "active" : ""}
          onClick={() => setAnimation((prev) => ({ ...prev, speed: 500 }))}
        >
          4x
        </button>
      </div>
    </div>
  );
}
