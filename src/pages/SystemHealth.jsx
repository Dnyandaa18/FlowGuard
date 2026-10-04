import { Activity, CheckCircle2, Database, Server, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { checkApiHealth, getWorkflows, getExecutions } from "../services/api";

function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [workflowCount, setWorkflowCount] = useState(0);
  const [executionCount, setExecutionCount] = useState(0);

  useEffect(() => {
    Promise.all([checkApiHealth(), getWorkflows(), getExecutions()])
      .then(([api, workflows, executions]) => {
        setHealth(api);
        setWorkflowCount(workflows.count || workflows.workflows?.length || 0);
        setExecutionCount(executions.count || executions.executions?.length || 0);
      })
      .catch((error) => {
        console.error("Unable to load system health:", error);
        setHealth({ success: false, database: "disconnected" });
      });
  }, []);

  const connected = health?.success && health?.database === "connected";

  return (
    <div className="health-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span></span>PLATFORM STATUS</div>
          <h1>System Health</h1>
          <p>Live status of the FlowGuard monitoring stack.</p>
        </div>
        <div className="lab-live-status"><span></span>MONITORING ACTIVE</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><Server size={20} /></div><div><span>API Server</span><strong>{connected ? "Online" : "Offline"}</strong><small>Express backend</small></div></div>
        <div className="stat-card"><div className="stat-icon green"><Database size={20} /></div><div><span>Database</span><strong>{connected ? "Connected" : "Unavailable"}</strong><small>MongoDB persistence</small></div></div>
        <div className="stat-card"><div className="stat-icon purple"><Activity size={20} /></div><div><span>Workflows</span><strong>{workflowCount}</strong><small>Protected workflows</small></div></div>
        <div className="stat-card"><div className="stat-icon yellow"><ShieldCheck size={20} /></div><div><span>Executions</span><strong>{executionCount}</strong><small>Recorded history</small></div></div>
      </div>

      <div className="page-state">
        <CheckCircle2 size={25} />
        <div><strong>{connected ? "All core services operational" : "Backend connection requires attention"}</strong><p>{connected ? "FlowGuard API and MongoDB are responding normally." : "Start the FlowGuard server and verify the database connection."}</p></div>
      </div>
    </div>
  );
}

export default SystemHealth;
