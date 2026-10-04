import {
  ArrowUpRight,
  MoreHorizontal,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

function formatExecutions(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value || "0";
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return number.toString();
}

function WorkflowCard({ workflow }) {
  const successRate =
    Number(workflow.successRate ?? 0);

  const isHealthy =
    workflow.status === "healthy";

  return (
    <div className="workflow-card">
      <div className="workflow-top">
        <div className="workflow-icon">
          {workflow.icon || "⚡"}
        </div>

        <button
          className="more-btn"
          type="button"
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="workflow-title">
        <h3>
          {workflow.name}
        </h3>

        <span>
          {workflow.description ||
            "Protected workflow"}
        </span>
      </div>

      <div className="workflow-meta">
        <div>
          <span>
            Success rate
          </span>

          <strong>
            {successRate}%
          </strong>
        </div>

        <div>
          <span>
            Executions
          </span>

          <strong>
            {formatExecutions(
              workflow.executions
            )}
          </strong>
        </div>
      </div>

      <div className="progress">
        <div
          style={{
            width: `${Math.min(
              Math.max(
                successRate,
                0
              ),
              100
            )}%`,
          }}
        ></div>
      </div>

      <div className="workflow-footer">
        <span
          className={`workflow-status ${
            workflow.status
          }`}
        >
          {isHealthy ? (
            <CircleCheck
              size={15}
            />
          ) : (
            <TriangleAlert
              size={15}
            />
          )}

          {isHealthy
            ? "Healthy"
            : "Needs attention"}
        </span>

        <button type="button">
          View
          <ArrowUpRight
            size={15}
          />
        </button>
      </div>
    </div>
  );
}

export default WorkflowCard;