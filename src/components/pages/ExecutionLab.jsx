
import { useState } from "react";
import {
  Activity,
  Play,
  ShieldCheck,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import ExecutionTimeline from "../ExecutionTimeline";
import AnomalyPanel from "../AnomalyPanel";
import RecoveryPanel from "../RecoveryPanel";

import {
  workflowSteps,
  simulationScenarios,
} from "../data/simulatorData";

function ExecutionLab() {
  const [status, setStatus] = useState("idle");
  const [scenario, setScenario] = useState(null);
  const [result, setResult] = useState(null);

  const runSimulation = (type) => {
    const simulation = simulationScenarios[type];

    setScenario(type);
    setResult(simulation);
    setStatus(type === "failure" ? "failure" : "success");
  };

  const handleRecovery = () => {
    setStatus("recovered");
  };

  const resetSimulation = () => {
    setStatus("idle");
    setScenario(null);
    setResult(null);
  };

  return (
    <div className="execution-lab">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            FLOWGUARD INTELLIGENCE ENGINE
          </div>

          <h1>Execution Intelligence Lab</h1>

          <p>
            Simulate workflow behavior, detect anomalies
            and test recovery strategies.
          </p>
        </div>

        <div className="lab-live-status">
          <span></span>
          SIMULATION ENVIRONMENT
        </div>
      </div>

      {/* Simulation Controls */}

      <div className="simulation-control">
        <div className="simulation-intro">
          <div className="simulation-icon">
            <Activity size={22} />
          </div>

          <div>
            <h2>Payment Processing Workflow</h2>
            <p>
              Payment Gateway → Validation → Database → Notification
            </p>
          </div>
        </div>

        <div className="simulation-buttons">
          <button
            className="run-success-btn"
            onClick={() => runSimulation("normal")}
          >
            <Play size={15} />
            Normal Run
          </button>

          <button
            className="run-failure-btn"
            onClick={() => runSimulation("failure")}
          >
            <AlertTriangle size={15} />
            Trigger Failure
          </button>

          <button
            className="reset-btn"
            onClick={resetSimulation}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Execution Status */}

      <div className={`execution-banner ${status}`}>
        <div className="banner-icon">
          {status === "failure" ? (
            <AlertTriangle size={21} />
          ) : status === "success" || status === "recovered" ? (
            <CheckCircle2 size={21} />
          ) : (
            <Activity size={21} />
          )}
        </div>

        <div>
          <h3>
            {status === "idle"
              ? "Ready to execute"
              : status === "failure"
              ? "Workflow anomaly detected!"
              : status === "recovered"
              ? "Workflow successfully recovered"
              : "Execution completed successfully"}
          </h3>

          <p>
            {status === "idle"
              ? "Choose a simulation scenario to begin."
              : status === "failure"
              ? "A database timeout has interrupted the workflow."
              : status === "recovered"
              ? "The recovery simulation has completed successfully."
              : "All workflow steps completed within expected limits."}
          </p>
        </div>

        <span className="banner-status">
          {status.toUpperCase()}
        </span>
      </div>

      {/* Metrics */}

      <div className="lab-metrics">
        <div className="lab-metric">
          <span>Execution Latency</span>
          <strong>
            {result ? `${result.latency}ms` : "--"}
          </strong>
          <small>Measured response time</small>
        </div>

        <div className="lab-metric">
          <span>Anomaly Score</span>
          <strong>
            {result ? `${result.anomalyScore}/100` : "--"}
          </strong>
          <small>Behavior deviation score</small>
        </div>

        <div className="lab-metric">
          <span>Failure Rate</span>
          <strong>
            {result ? result.failureRate : "--"}
          </strong>
          <small>Detected execution failures</small>
        </div>

        <div className="lab-metric">
          <span>Recovery Status</span>
          <strong className={status === "recovered" ? "safe-text" : ""}>
            {status === "recovered"
              ? "Restored"
              : status === "failure"
              ? "Required"
              : status === "success"
              ? "Not needed"
              : "Pending"}
          </strong>
          <small>Current recovery state</small>
        </div>
      </div>

      {/* Main Intelligence Grid */}

      <div className="lab-grid">
        <div className="lab-left">
          <ExecutionTimeline
            steps={workflowSteps}
            scenario={scenario}
            status={status}
          />

          <div className="execution-events">
            <div className="execution-panel-heading">
              <div>
                <h2>Execution Event Log</h2>
                <p>System-generated execution events</p>
              </div>

              <Zap size={19} color="#a78bfa" />
            </div>

            {!result ? (
              <p className="empty-events">
                No execution events yet. Run a simulation.
              </p>
            ) : (
              <div className="event-list">
                {result.events.map((event, index) => (
                  <div className="event-item" key={index}>
                    <span className={
                      status === "failure" && index === 2
                        ? "event-dot failed"
                        : "event-dot"
                    }></span>

                    <span>{event}</span>

                    <small>
                      {String(index + 1).padStart(2, "0")}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lab-right">
          <AnomalyPanel result={result} status={status} />

          <RecoveryPanel
            result={result}
            status={status}
            onRecover={handleRecovery}
            onReset={resetSimulation}
          />
        </div>
      </div>

      <div className="lab-footer">
        <ShieldCheck size={16} />
        FlowGuard Intelligence Engine
        <span>Frontend simulation mode</span>
      </div>
    </div>
  );
}

export default ExecutionLab;