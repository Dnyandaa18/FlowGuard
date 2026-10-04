import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getExecutions } from "../services/api";

function Incidents() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExecutions()
      .then((response) => {
        setExecutions((response.executions || []).filter((execution) => execution.status === "failed" || execution.anomaly?.anomalous));
      })
      .catch((error) => console.error("Unable to load incidents:", error))
      .finally(() => setLoading(false));
  }, []);

  const highPriority = executions.filter((item) => ["Critical", "High"].includes(item.anomaly?.risk)).length;

  return (
    <div className="incidents-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span></span>RISK CENTER</div>
          <h1>Incidents</h1>
          <p>Detected workflow anomalies requiring attention.</p>
        </div>
        <div className="lab-live-status"><span></span>LIVE DETECTION</div>
      </div>

      <div className="history-summary">
        <div><ShieldAlert size={19} /><div><span>Open incidents</span><strong>{executions.length}</strong></div></div>
        <div><AlertTriangle size={19} /><div><span>High priority</span><strong>{highPriority}</strong></div></div>
        <div><div><span>Detection engine</span><strong>Active</strong></div></div>
      </div>

      {loading ? (
        <div className="page-state"><Clock size={24} />Analyzing recent executions...</div>
      ) : executions.length === 0 ? (
        <div className="page-state"><CheckCircle2 size={24} /><div><strong>No active incidents</strong><p>FlowGuard has not detected an anomalous execution yet.</p></div></div>
      ) : (
        <div className="history-panel">
          <div className="history-header"><span>WORKFLOW</span><span>RISK</span><span>SCORE</span><span>METHOD</span><span>LATENCY</span></div>
          {executions.map((execution) => {
            const risk = execution.anomaly?.risk || "Low";
            return (
              <div className="history-row" key={execution.executionId}>
                <div className="history-workflow"><strong>{execution.workflowName}</strong><small>{execution.executionId}</small></div>
                <div className={"history-risk " + risk.toLowerCase()}>{risk}</div>
                <strong>{execution.anomaly?.anomalyScore ?? 0}/100</strong>
                <span>{execution.anomaly?.method === "historical-baseline" ? "Historical baseline" : "Configured threshold"}</span>
                <span>{execution.latency}ms</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Incidents;
