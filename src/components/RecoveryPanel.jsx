import {
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

function RecoveryPanel({
  result,
  status,
  onRecover,
  onReset,
}) {
  const recovery =
    result?.recovery;

  const isFailure =
    status === "failure";

  const isRecovered =
    status === "recovered";

  if (!result) {
    return (
      <div className="recovery-panel">
        <div className="recovery-heading">
          <div className="recovery-icon">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h2>
              AI Recovery Assistant
            </h2>

            <p>
              Intelligent response recommendations
            </p>
          </div>
        </div>

        <div className="recovery-empty">
          <ShieldCheck size={34} />

          <h3>
            Awaiting execution data
          </h3>

          <p>
            Run your workflow to receive
            anomaly analysis and recovery
            recommendations.
          </p>
        </div>
      </div>
    );
  }

  const actions =
    recovery?.actions || [];

  return (
    <div className="recovery-panel">
      <div className="recovery-heading">
        <div className="recovery-icon">
          <BrainCircuit size={22} />
        </div>

        <div>
          <h2>
            AI Recovery Assistant
          </h2>

          <p>
            Intelligent response recommendations
          </p>
        </div>
      </div>

      <div
        className={`recommendation ${
          isFailure
            ? "warning"
            : ""
        }`}
      >
        <div className="recommendation-label">
          {isRecovered
            ? "RECOVERY RESULT"
            : isFailure
            ? "RECOMMENDED ACTION"
            : "SYSTEM ANALYSIS"}
        </div>

        <h3>
          {isRecovered
            ? "Recovery simulation successful"
            : recovery?.title ||
              "Workflow operating normally"}
        </h3>

        <p>
          {isRecovered
            ? "The simulated recovery sequence completed successfully."
            : recovery?.explanation ||
              "No significant abnormal behavior was detected."}
        </p>
      </div>

      {isFailure &&
        actions.length > 0 && (
          <div className="recovery-actions">
            {actions.map(
              (action, index) => (
                <div
                  key={action}
                >
                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {action}
                </div>
              )
            )}
          </div>
        )}

      {isRecovered && (
        <div className="recovered-message">
          <CheckCircle2 size={17} />

          Recovery completed
          successfully
        </div>
      )}

      <div className="recovery-buttons">
        {isFailure && (
          <button
            className="recovery-action-btn"
            onClick={onRecover}
          >
            <ShieldCheck size={17} />

            Simulate Recovery

            <ArrowRight size={16} />
          </button>
        )}

        {!isFailure && (
          <button
            className="reset-action-btn"
            onClick={onReset}
          >
            <RotateCcw size={15} />

            Run New Simulation
          </button>
        )}
      </div>

      <p className="ai-disclaimer">
        FlowGuard recovery engine ·
        Deterministic recommendation layer
      </p>
    </div>
  );
}

export default RecoveryPanel;