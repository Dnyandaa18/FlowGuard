import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  Play,
  ShieldCheck,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  ChevronDown,
} from "lucide-react";

import ExecutionTimeline from "../components/ExecutionTimeline";
import AnomalyPanel from "../components/AnomalyPanel";
import RecoveryPanel from "../components/RecoveryPanel";

import {
  getWorkflows,
  runWorkflow,
} from "../services/api";

function ExecutionLab() {
  const [workflows, setWorkflows] =
    useState([]);

  const [selectedWorkflowId, setSelectedWorkflowId] =
    useState("");

  const [status, setStatus] =
    useState("idle");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [loadingWorkflows, setLoadingWorkflows] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadWorkflows =
      async () => {
        try {
          setLoadingWorkflows(
            true
          );
          setError("");

          const response =
            await getWorkflows();

          if (!response.success) {
            throw new Error(
              response.message ||
                "Unable to load workflows."
            );
          }

          const available =
            response.workflows ||
            [];

          setWorkflows(
            available
          );

          if (
            available.length >
              0
          ) {
            setSelectedWorkflowId(
              available[0].id
            );
          }
        } catch (err) {
          console.error(err);

          setError(
            err.message ||
              "Unable to load workflows."
          );
        } finally {
          setLoadingWorkflows(
            false
          );
        }
      };

    loadWorkflows();
  }, []);

  const selectedWorkflow =
    workflows.find(
      (workflow) =>
        workflow.id ===
        selectedWorkflowId
    );

  const executeWorkflow =
    async (scenario) => {
      if (
        !selectedWorkflowId
      ) {
        setError(
          "Please select a workflow first."
        );
        return;
      }

      try {
        setLoading(true);
        setError("");
        setResult(null);
        setStatus("running");

        const response =
          await runWorkflow(
            selectedWorkflowId,
            scenario
          );

        if (!response.success) {
          throw new Error(
            response.message ||
              "Execution failed."
          );
        }

        const execution =
          response.execution;

        setResult(
          execution
        );

        setStatus(
          execution.status ===
            "failed"
            ? "failure"
            : "success"
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to execute workflow."
        );

        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

  const handleRecovery = () => {
    setStatus("recovered");
  };

  const resetSimulation = () => {
    setStatus("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="execution-lab">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            FLOWGUARD INTELLIGENCE ENGINE
          </div>

          <h1>
            Execution Intelligence Lab
          </h1>

          <p>
            Execute real workflows through
            the FlowGuard backend and
            analyze their behavior.
          </p>
        </div>

        <div className="lab-live-status">
          <span></span>
          LIVE BACKEND MODE
        </div>
      </div>

      <div className="simulation-control">
        <div className="simulation-intro">
          <div className="simulation-icon">
            <Activity size={22} />
          </div>

          <div>
            <h2>
              {selectedWorkflow
                ? selectedWorkflow.name
                : "Select a workflow"}
            </h2>

            <p>
              {selectedWorkflow
                ? selectedWorkflow.steps
                    .map(
                      (step) =>
                        step.service
                    )
                    .join(
                      " → "
                    )
                : "No workflow selected"}
            </p>
          </div>
        </div>

        <div className="simulation-controls">
          <div className="workflow-select-wrapper">
            <label htmlFor="lab-workflow">
              Workflow
            </label>

            <div className="workflow-select">
              <select
                id="lab-workflow"
                value={
                  selectedWorkflowId
                }
                onChange={(
                  event
                ) => {
                  setSelectedWorkflowId(
                    event.target
                      .value
                  );
                  resetSimulation();
                }}
                disabled={
                  loadingWorkflows ||
                  loading
                }
              >
                {loadingWorkflows ? (
                  <option>
                    Loading workflows...
                  </option>
                ) : workflows.length ===
                  0 ? (
                  <option>
                    No workflows available
                  </option>
                ) : (
                  workflows.map(
                    (
                      workflow
                    ) => (
                      <option
                        key={
                          workflow.id
                        }
                        value={
                          workflow.id
                        }
                      >
                        {
                          workflow.name
                        }
                      </option>
                    )
                  )
                )}
              </select>

              <ChevronDown
                size={16}
              />
            </div>
          </div>

          <div className="simulation-buttons">
            <button
              className="run-success-btn"
              disabled={
                loading ||
                !selectedWorkflowId
              }
              onClick={() =>
                executeWorkflow(
                  "normal"
                )
              }
            >
              {loading &&
              status ===
                "running" ? (
                <LoaderCircle
                  size={15}
                  className="spin"
                />
              ) : (
                <Play size={15} />
              )}

              Normal Run
            </button>

            <button
              className="run-failure-btn"
              disabled={
                loading ||
                !selectedWorkflowId
              }
              onClick={() =>
                executeWorkflow(
                  "failure"
                )
              }
            >
              <AlertTriangle
                size={15}
              />

              Trigger Failure
            </button>

            <button
              className="reset-btn"
              onClick={
                resetSimulation
              }
              disabled={loading}
            >
              <RotateCcw
                size={15}
              />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="execution-banner failure">
          <div className="banner-icon">
            <AlertTriangle
              size={21}
            />
          </div>

          <div>
            <h3>
              Execution error
            </h3>

            <p>
              {error}
            </p>
          </div>
        </div>
      )}

      {!error && (
        <div
          className={`execution-banner ${status}`}
        >
          <div className="banner-icon">
            {status ===
            "failure" ? (
              <AlertTriangle
                size={21}
              />
            ) : status ===
                "success" ||
              status ===
                "recovered" ? (
              <CheckCircle2
                size={21}
              />
            ) : status ===
              "running" ? (
              <LoaderCircle
                size={21}
                className="spin"
              />
            ) : (
              <Activity
                size={21}
              />
            )}
          </div>

          <div>
            <h3>
              {status ===
              "idle"
                ? "Ready to execute"
                : status ===
                  "running"
                ? "Executing workflow..."
                : status ===
                  "failure"
                ? "Workflow anomaly detected!"
                : status ===
                  "recovered"
                ? "Workflow successfully recovered"
                : "Execution completed successfully"}
            </h3>

            <p>
              {status ===
              "idle"
                ? "Choose a scenario to execute the selected workflow."
                : status ===
                  "running"
                ? "FlowGuard is analyzing the workflow execution."
                : status ===
                  "failure"
                ? "The backend detected abnormal workflow behavior."
                : status ===
                  "recovered"
                ? "The recovery simulation has completed successfully."
                : "All workflow steps completed within expected limits."}
            </p>
          </div>

          <span className="banner-status">
            {status.toUpperCase()}
          </span>
        </div>
      )}

      <div className="lab-metrics">
        <div className="lab-metric">
          <span>
            Execution Latency
          </span>

          <strong>
            {result
              ? `${result.latency}ms`
              : "--"}
          </strong>

          <small>
            Measured response time
          </small>
        </div>

        <div className="lab-metric">
          <span>
            Anomaly Score
          </span>

          <strong>
            {result
              ? `${result.anomaly.anomalyScore}/100`
              : "--"}
          </strong>

          <small>
            Behavior deviation score
          </small>
        </div>

        <div className="lab-metric">
          <span>
            Failure Rate
          </span>

          <strong>
            {result
              ? `${result.failureRate}%`
              : "--"}
          </strong>

          <small>
            Detected execution failures
          </small>
        </div>

        <div className="lab-metric">
          <span>
            Recovery Status
          </span>

          <strong
            className={
              status ===
              "recovered"
                ? "safe-text"
                : ""
            }
          >
            {status ===
            "recovered"
              ? "Restored"
              : status ===
                "failure"
              ? "Required"
              : status ===
                "success"
              ? "Not needed"
              : "Pending"}
          </strong>

          <small>
            Current recovery state
          </small>
        </div>
      </div>

      <div className="lab-grid">
        <div className="lab-left">
          <ExecutionTimeline
            steps={
              result?.steps ||
              []
            }
          />

          <div className="execution-events">
            <div className="execution-panel-heading">
              <div>
                <h2>
                  Execution Event Log
                </h2>

                <p>
                  Backend-generated
                  execution events
                </p>
              </div>

              <Zap size={19} />
            </div>

            {!result ? (
              <p className="empty-events">
                No execution events
                yet. Run a workflow.
              </p>
            ) : (
              <div className="event-list">
                {result.events.map(
                  (
                    event,
                    index
                  ) => (
                    <div
                      className="event-item"
                      key={index}
                    >
                      <span
                        className={`event-dot ${
                          result.status ===
                            "failed" &&
                          index ===
                            2
                            ? "failed"
                            : ""
                        }`}
                      ></span>

                      <span>
                        {event}
                      </span>

                      <small>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </small>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lab-right">
          <AnomalyPanel
            result={result}
            status={status}
          />

          <RecoveryPanel
            result={result}
            status={status}
            onRecover={
              handleRecovery
            }
            onReset={
              resetSimulation
            }
          />
        </div>
      </div>

      <div className="lab-footer">
        <ShieldCheck size={16} />

        FlowGuard Intelligence Engine

        <span>
          Connected to Express API
        </span>
      </div>
    </div>
  );
}

export default ExecutionLab;