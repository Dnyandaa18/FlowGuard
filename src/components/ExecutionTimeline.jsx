
import {
  CircleCheck,
  CircleX,
  Clock,
  LoaderCircle,
} from "lucide-react";

function ExecutionTimeline({ steps, scenario, status }) {
  const getStepStatus = (index) => {
    if (status === "idle") return "pending";

    if (scenario === "normal" || status === "recovered") {
      return "completed";
    }

    if (index < 2) return "completed";
    if (index === 2) return "failed";

    return "pending";
  };

  const getIcon = (stepStatus) => {
    if (stepStatus === "completed") {
      return <CircleCheck size={19} />;
    }

    if (stepStatus === "failed") {
      return <CircleX size={19} />;
    }

    return <Clock size={19} />;
  };

  return (
    <div className="execution-panel">
      <div className="execution-panel-heading">
        <div>
          <h2>Execution Timeline</h2>
          <p>Step-by-step workflow execution</p>
        </div>

        <span className="timeline-count">
          {steps.length} STEPS
        </span>
      </div>

      <div className="timeline">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);

          return (
            <div className="timeline-item" key={step.id}>
              <div className={`timeline-marker ${stepStatus}`}>
                {getIcon(stepStatus)}
              </div>

              <div className="timeline-content">
                <div className="timeline-top">
                  <div>
                    <h3>{step.name}</h3>
                    <span>{step.service}</span>
                  </div>

                  <span className={`step-badge ${stepStatus}`}>
                    {stepStatus}
                  </span>
                </div>

                <div className="timeline-bottom">
                  <span>
                    <LoaderCircle size={12} />
                    {stepStatus === "failed"
                      ? "2840ms"
                      : stepStatus === "completed"
                      ? step.duration
                      : "--"}
                  </span>

                  <span>Step {step.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExecutionTimeline;