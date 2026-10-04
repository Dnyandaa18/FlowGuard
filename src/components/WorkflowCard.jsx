import {
  ArrowUpRight,
  MoreHorizontal,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

function WorkflowCard({ workflow }) {
  return (
    <div className="workflow-card">
      <div className="workflow-top">
        <div className="workflow-icon">
          {workflow.icon}
        </div>

        <button className="more-btn">
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="workflow-title">
        <h3>{workflow.name}</h3>
        <span>{workflow.description}</span>
      </div>

      <div className="workflow-meta">
        <div>
          <span>Success rate</span>
          <strong>{workflow.success}%</strong>
        </div>

        <div>
          <span>Executions</span>
          <strong>{workflow.executions}</strong>
        </div>
      </div>

      <div className="progress">
        <div
          style={{ width: `${workflow.success}%` }}
        ></div>
      </div>

      <div className="workflow-footer">
        <span className={`workflow-status ${workflow.status}`}>
          {workflow.status === "healthy" ? (
            <CircleCheck size={15} />
          ) : (
            <TriangleAlert size={15} />
          )}

          {workflow.status === "healthy"
            ? "Healthy"
            : "Needs attention"}
        </span>

        <button>
          View
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default WorkflowCard;