import "./DataSourceBadge.css";

export default function DataSourceBadge({ metadata, depth, variable }) {
  if (!metadata && variable !== "current") return null;

  const provider = metadata?.provider || "Copernicus Marine / Open-Meteo API";
  const dataTimestamp = metadata?.data_timestamp || "Latest Available";
  const lastSync = metadata?.last_synchronized || "Just now";
  const isCached = metadata?.is_cached;
  const isStale = metadata?.stale_fallback;

  let statusLabel = "● Live / Near Real-Time";
  let statusClass = "live";

  if (isStale) {
    statusLabel = "● Offline Fallback (Stale)";
    statusClass = "stale";
  } else if (isCached) {
    statusLabel = "● Near Real-Time (Cached)";
    statusClass = "cached";
  }

  return (
    <div className="sagarx-datasource-badge">
      <div className="sagarx-badge-header">
        <span className={`sagarx-status-dot ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="sagarx-badge-grid">
        <div className="sagarx-badge-item">
          <span className="sagarx-badge-label">Data Source</span>
          <span className="sagarx-badge-value">{provider}</span>
        </div>

        <div className="sagarx-badge-item">
          <span className="sagarx-badge-label">Data Timestamp</span>
          <span className="sagarx-badge-value highlight">{dataTimestamp}</span>
        </div>

        <div className="sagarx-badge-item">
          <span className="sagarx-badge-label">Last Synchronized</span>
          <span className="sagarx-badge-value">{lastSync}</span>
        </div>

        <div className="sagarx-badge-item">
          <span className="sagarx-badge-label">Depth Slicing</span>
          <span className="sagarx-badge-value">{depth} m</span>
        </div>

        <div className="sagarx-badge-item">
          <span className="sagarx-badge-label">Variable & Units</span>
          <span className="sagarx-badge-value">Ocean Current (m/s)</span>
        </div>
      </div>

      {metadata?.warning && (
        <p className="sagarx-badge-warning">{metadata.warning}</p>
      )}
    </div>
  );
}
