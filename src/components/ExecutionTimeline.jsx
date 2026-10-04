import {
  CircleCheck,
  CircleX,
  Clock,
  LoaderCircle,
} from "lucide-react";

function ExecutionTimeline({
  steps = [],
}) {
  const getIcon = (status) => {
    if (status === "completed") {
      return <CircleCheck size={19} />;
    }

    if (status === "failed") {
      return <CircleX size={19} />;
    }

    return <Clock size={19} />;
  };

  return (
    <div className="execution-panel">
      <div className="execution-panel-heading">
        <div>
          <h2>Execution Timeline</h2>

          <p>
            Step-by-step workflow execution
          </p>
        </div>

        <span className="timeline-count">
          {steps.length} STEPS
        </span>
      </div>

      <div className="timeline">
        {steps.map((step) => {
          const status =
            step.status || "pending";

          return (
            <div
              className="timeline-item"
              key={step.id}
            >
              <div
                className={`timeline-marker ${status}`}
              >
                {getIcon(status)}
              </div>

              <div className="timeline-content">
                <div className="timeline-top">
                  <div>
                    <h3>
                      {step.name}
                    </h3>

                    <span>
                      {step.service}
                    </span>
                  </div>

                  <span
                    className={`step-badge ${status}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="timeline-bottom">
                  <span>
                    <LoaderCircle size={12} />

                    {step.actualLatency !==
                    null &&
                    step.actualLatency !==
                      undefined
                      ? `${step.actualLatency}ms`
                      : "--"}
                  </span>

                  <span>
                    Expected:{" "}
                    {step.expectedLatency}ms
                  </span>
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