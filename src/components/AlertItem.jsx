import {
  TriangleAlert,
  CircleCheck,
  ArrowUpRight,
} from "lucide-react";

function AlertItem({ alert }) {
  return (
    <div className="alert-item">
      <div className={`alert-icon ${alert.type}`}>
        {alert.type === "critical" ? (
          <TriangleAlert size={18} />
        ) : (
          <CircleCheck size={18} />
        )}
      </div>

      <div className="alert-content">
        <strong>{alert.title}</strong>
        <span>{alert.description}</span>
        <small>{alert.time}</small>
      </div>

      <button className="alert-arrow">
        <ArrowUpRight size={17} />
      </button>
    </div>
  );
}

export default AlertItem;