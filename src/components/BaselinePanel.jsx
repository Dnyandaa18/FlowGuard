import {
  Activity,
  BrainCircuit,
  Database,
  Gauge,
  TrendingUp,
} from "lucide-react";

function BaselinePanel({
  baseline,
  loading,
}) {
  if (loading) {
    return (
      <div className="baseline-panel">
        <div className="baseline-heading">
          <div className="baseline-icon">
            <BrainCircuit size={18} />
          </div>

          <div>
            <h2>
              Historical Baseline
            </h2>

            <p>
              FlowGuard is learning normal behavior.
            </p>
          </div>
        </div>

        <div className="baseline-loading">
          Loading baseline intelligence...
        </div>
      </div>
    );
  }

  if (!baseline) {
    return (
      <div className="baseline-panel">
        <div className="baseline-heading">
          <div className="baseline-icon">
            <BrainCircuit size={18} />
          </div>

          <div>
            <h2>
              Historical Baseline
            </h2>

            <p>
              No baseline data available yet.
            </p>
          </div>
        </div>

        <div className="baseline-empty">
          <BrainCircuit size={25} />

          <strong>
            Learning will begin automatically
          </strong>

          <span>
            Execute this workflow several times
            so FlowGuard can learn its normal
            operating behavior.
          </span>
        </div>
      </div>
    );
  }

  const latency =
    baseline.latency || {};

  const services =
    baseline.services || [];

  const learningComplete =
    baseline.learningStatus ===
    "learned";

  return (
    <div className="baseline-panel">
      <div className="baseline-heading">
        <div className="baseline-icon">
          <BrainCircuit size={18} />
        </div>

        <div>
          <h2>
            Historical Baseline
          </h2>

          <p>
            Learned from previous executions.
          </p>
        </div>

        <span
          className={`baseline-status ${
            learningComplete
              ? "learned"
              : "learning"
          }`}
        >
          {learningComplete
            ? "LEARNED"
            : "LEARNING"}
        </span>
      </div>

      <div className="baseline-sample">
        <div>
          <span>
            Historical samples
          </span>

          <strong>
            {latency.sampleCount || 0}
          </strong>
        </div>

        <div>
          <span>
            Required
          </span>

          <strong>
            {baseline.minimumSamplesRequired ||
              5}
          </strong>
        </div>

        <div>
          <span>
            Failure rate
          </span>

          <strong>
            {baseline.failureRate || 0}%
          </strong>
        </div>
      </div>

      <div className="baseline-grid">
        <div className="baseline-stat">
          <Activity size={16} />

          <span>
            Average latency
          </span>

          <strong>
            {latency.average || 0}ms
          </strong>
        </div>

        <div className="baseline-stat">
          <Gauge size={16} />

          <span>
            Standard deviation
          </span>

          <strong>
            {latency.standardDeviation || 0}ms
          </strong>
        </div>

        <div className="baseline-stat">
          <TrendingUp size={16} />

          <span>
            P95 latency
          </span>

          <strong>
            {latency.p95 || 0}ms
          </strong>
        </div>

        <div className="baseline-stat">
          <Database size={16} />

          <span>
            Observed range
          </span>

          <strong>
            {latency.minimum || 0}–
            {latency.maximum || 0}ms
          </strong>
        </div>
      </div>

      <div className="baseline-explanation">
        <strong>
          How FlowGuard uses this
        </strong>

        <p>
          New executions are compared against
          this historical behavior. Large deviations
          increase the anomaly score and may trigger
          a higher risk level.
        </p>
      </div>

      {services.length > 0 && (
        <div className="service-baselines">
          <div className="service-baseline-heading">
            <div>
              <strong>
                Service Baselines
              </strong>

              <span>
                Learned latency per service
              </span>
            </div>
          </div>

          {services.map(
            (service) => (
              <div
                className="service-baseline-row"
                key={service.service}
              >
                <span>
                  {service.service}
                </span>

                <strong>
                  {service.average}ms
                </strong>

                <small>
                  P95 {service.p95}ms
                </small>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default BaselinePanel;