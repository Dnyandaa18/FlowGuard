
import {
  Activity,
  AlertTriangle,
  Gauge,
  ShieldCheck,
} from "lucide-react";

function AnomalyPanel({ result, status }) {
  const isCritical =
    result &&
    result.risk === "Critical" &&
    status !== "recovered";

  const metrics = [
    {
      label: "Anomaly Score",
      value: result ? `${result.anomalyScore}/100` : "--",
      icon: <Gauge size={18} />,
      critical: isCritical,
    },
    {
      label: "Execution Latency",
      value: result ? `${result.latency}ms` : "--",
      icon: <Activity size={18} />,
      critical: isCritical,
    },
    {
      label: "Failure Rate",
      value: result ? result.failureRate : "--",
      icon: <AlertTriangle size={18} />,
      critical: isCritical,
    },
  ];

  return (
    <div className="anomaly-panel">
      <div className="anomaly-heading">
        <div>
          <h2>Anomaly Intelligence</h2>
          <p>Workflow behavior analysis</p>
        </div>

        <ShieldCheck size={21} />
      </div>

      <div className="anomaly-score">
        <div
          className={`score-circle ${
            isCritical ? "critical" : result ? "safe" : ""
          }`}
        >
          <strong>
            {result ? result.anomalyScore : "--"}
          </strong>
          <span>RISK SCORE</span>
        </div>

        <div>
          <span className="metric-caption">Current Risk Level</span>

          <h3 className={isCritical ? "danger-text" : "safe-text"}>
            {result ? result.risk : "Not analyzed"}
          </h3>

          <p>
            {result
              ? isCritical
                ? "Unusual behavior detected."
                : "No significant anomaly detected."
              : "Run a simulation to analyze behavior."}
          </p>
        </div>
      </div>

      <div className="anomaly-metrics">
        {metrics.map((metric) => (
          <div className="anomaly-metric" key={metric.label}>
            <div className="metric-icon">
              {metric.icon}
            </div>

            <div>
              <span>{metric.label}</span>
              <strong className={metric.critical ? "danger-text" : ""}>
                {metric.value}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <div className={`detection-status ${isCritical ? "detected" : ""}`}>
        <span className="detection-dot"></span>

        {result
          ? isCritical
            ? "Anomaly detected in execution"
            : "Execution within expected parameters"
          : "Waiting for execution data"}
      </div>
    </div>
  );
}

export default AnomalyPanel;