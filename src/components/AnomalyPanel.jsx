import {
  Activity,
  AlertTriangle,
  Gauge,
  ShieldCheck,
} from "lucide-react";

function AnomalyPanel({
  result,
  status,
}) {
  const anomaly =
    result?.anomaly;

  const isAnomalous =
    anomaly?.anomalous &&
    status !== "recovered";

  const score =
    anomaly?.anomalyScore;

  const risk =
    anomaly?.risk;

  const metrics = [
    {
      label: "Anomaly Score",
      value:
        score !== undefined
          ? `${score}/100`
          : "--",
      icon: <Gauge size={18} />,
    },
    {
      label: "Execution Latency",
      value:
        result
          ? `${result.latency}ms`
          : "--",
      icon: <Activity size={18} />,
    },
    {
      label: "Failure Rate",
      value:
        result
          ? `${result.failureRate}%`
          : "--",
      icon: (
        <AlertTriangle size={18} />
      ),
    },
  ];

  return (
    <div className="anomaly-panel">
      <div className="anomaly-heading">
        <div>
          <h2>
            Anomaly Intelligence
          </h2>

          <p>
            Workflow behavior analysis
          </p>
        </div>

        <ShieldCheck size={21} />
      </div>

      <div className="anomaly-score">
        <div
          className={`score-circle ${
            isAnomalous
              ? "critical"
              : result
              ? "safe"
              : ""
          }`}
        >
          <strong>
            {score ?? "--"}
          </strong>

          <span>
            RISK SCORE
          </span>
        </div>

        <div>
          <span className="metric-caption">
            Current Risk Level
          </span>

          <h3
            className={
              isAnomalous
                ? "danger-text"
                : "safe-text"
            }
          >
            {risk || "Not analyzed"}
          </h3>

          <p>
            {result
              ? isAnomalous
                ? "Abnormal workflow behavior detected."
                : "Execution is within expected parameters."
              : "Run a workflow to analyze behavior."}
          </p>
        </div>
      </div>

      <div className="anomaly-metrics">
        {metrics.map(
          (metric) => (
            <div
              className="anomaly-metric"
              key={metric.label}
            >
              <div className="metric-icon">
                {metric.icon}
              </div>

              <div>
                <span>
                  {metric.label}
                </span>

                <strong
                  className={
                    isAnomalous
                      ? "danger-text"
                      : ""
                  }
                >
                  {metric.value}
                </strong>
              </div>
            </div>
          )
        )}
      </div>

      <div
        className={`detection-status ${
          isAnomalous
            ? "detected"
            : ""
        }`}
      >
        <span className="detection-dot"></span>

        {result
          ? isAnomalous
            ? "Anomaly detected in execution"
            : "Execution within expected parameters"
          : "Waiting for execution data"}
      </div>
    </div>
  );
}

export default AnomalyPanel;