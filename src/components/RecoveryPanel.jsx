
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
  const isFailure = status === "failure";
  const isRecovered = status === "recovered";

  return (
    <div className="recovery-panel">
      <div className="recovery-heading">
        <div className="recovery-icon">
          <BrainCircuit size={22} />
        </div>

        <div>
          <h2>AI Recovery Assistant</h2>
          <p>Intelligent response recommendations</p>
        </div>
      </div>

      {!result ? (
        <div className="recovery-empty">
          <ShieldCheck size={34} />

          <h3>Awaiting execution data</h3>

          <p>
            Run your workflow to receive intelligent
            monitoring insights and recovery recommendations.
          </p>
        </div>
      ) : (
        <>
          <div className={`recommendation ${isFailure ? "warning" : ""}`}>
            <div className="recommendation-label">
              {isFailure ? "RECOMMENDED ACTION" : "SYSTEM ANALYSIS"}
            </div>

            <h3>
              {isRecovered
                ? "Recovery simulation successful"
                : isFailure
                ? "Database failure detected"
                : "Workflow is operating normally"}
            </h3>

            <p>
              {isRecovered
                ? "The simulated failover and retry completed. The workflow is ready for another execution."
                : result.recommendation}
            </p>
          </div>

          {isFailure && (
            <div className="recovery-actions">
              <div>
                <span>01</span>
                Enable database failover
              </div>

              <div>
                <span>02</span>
                Retry failed operation
              </div>

              <div>
                <span>03</span>
                Verify transaction consistency
              </div>
            </div>
          )}

          {isRecovered && (
            <div className="recovered-message">
              <CheckCircle2 size={17} />
              Recovery completed in simulation
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
            Demo recommendation engine · Not connected to a live AI model yet
          </p>
        </>
      )}
    </div>
  );
}

export default RecoveryPanel;