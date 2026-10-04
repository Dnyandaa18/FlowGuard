import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import {
  getExecutions,
} from "../services/api";

function formatDate(value) {
  if (!value) {
    return "--";
  }

  return new Date(
    value
  ).toLocaleString();
}

function getStatusIcon(status) {
  if (status === "completed") {
    return (
      <CheckCircle2
        size={17}
      />
    );
  }

  return (
    <AlertTriangle
      size={17}
    />
  );
}

function ExecutionHistory() {
  const [executions, setExecutions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadExecutions =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getExecutions();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to load execution history."
          );
        }

        setExecutions(
          response.executions ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load execution history."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadExecutions();
  }, []);

  return (
    <div className="execution-history">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            EXECUTION INTELLIGENCE
          </div>

          <h1>
            Execution History
          </h1>

          <p>
            Persistent execution records
            captured by FlowGuard.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={
            loadExecutions
          }
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle
              size={17}
              className="spin"
            />
          ) : (
            <RefreshCw
              size={17}
            />
          )}

          Refresh
        </button>
      </div>

      <div className="history-summary">
        <div>
          <Activity size={19} />

          <div>
            <span>
              Total Executions
            </span>

            <strong>
              {executions.length}
            </strong>
          </div>
        </div>

        <div>
          <CheckCircle2
            size={19}
          />

          <div>
            <span>
              Successful
            </span>

            <strong>
              {
                executions.filter(
                  (execution) =>
                    execution.status ===
                    "completed"
                ).length
              }
            </strong>
          </div>
        </div>

        <div>
          <ShieldAlert
            size={19}
          />

          <div>
            <span>
              Failed
            </span>

            <strong>
              {
                executions.filter(
                  (execution) =>
                    execution.status ===
                    "failed"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {loading && (
        <div className="page-state">
          <LoaderCircle
            size={23}
            className="spin"
          />

          Loading execution history...
        </div>
      )}

      {!loading && error && (
        <div className="page-state error">
          <AlertTriangle
            size={23}
          />

          <div>
            <strong>
              Unable to load history
            </strong>

            <p>
              {error}
            </p>
          </div>

          <button
            className="reset-btn"
            onClick={
              loadExecutions
            }
          >
            <RefreshCw
              size={15}
            />

            Retry
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        executions.length ===
          0 && (
          <div className="page-state">
            <Clock size={24} />

            <div>
              <strong>
                No executions yet
              </strong>

              <p>
                Run a workflow from the
                Execution Lab to create
                your first history record.
              </p>
            </div>
          </div>
        )}

      {!loading &&
        !error &&
        executions.length >
          0 && (
          <div className="history-panel">
            <div className="history-header">
              <span>
                WORKFLOW
              </span>

              <span>
                STATUS
              </span>

              <span>
                LATENCY
              </span>

              <span>
                ANOMALY
              </span>

              <span>
                DATE
              </span>
            </div>

            {executions.map(
              (execution) => {
                const risk =
                  execution
                    .anomaly
                    ?.risk ||
                  "Low";

                return (
                  <div
                    className="history-row"
                    key={
                      execution.executionId
                    }
                  >
                    <div className="history-workflow">
                      <strong>
                        {
                          execution.workflowName
                        }
                      </strong>

                      <small>
                        {
                          execution.executionId
                        }
                      </small>
                    </div>

                    <div
                      className={`history-status ${
                        execution.status
                      }`}
                    >
                      {getStatusIcon(
                        execution.status
                      )}

                      {execution.status}
                    </div>

                    <strong>
                      {
                        execution.latency
                      }ms
                    </strong>

                    <div
                      className={`history-risk ${risk.toLowerCase()}`}
                    >
                      {
                        execution
                          .anomaly
                          ?.anomalyScore
                      }
                      /100

                      <small>
                        {risk}
                      </small>
                    </div>

                    <span className="history-date">
                      {formatDate(
                        execution.startedAt
                      )}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
    </div>
  );
}

export default ExecutionHistory;