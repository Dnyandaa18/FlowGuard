function clamp(
  value,
  min,
  max
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function calculateLatencyScore({
  latency,
  expectedLatency,
}) {
  if (
    !expectedLatency ||
    expectedLatency <= 0
  ) {
    return 0;
  }

  const ratio =
    latency /
    expectedLatency;

  if (ratio <= 1) return 5;
  if (ratio <= 1.25) return 15;
  if (ratio <= 1.5) return 30;
  if (ratio <= 2) return 50;
  if (ratio <= 4) return 75;

  return 95;
}

function calculateFailureScore(
  failureRate = 0
) {
  return clamp(
    Number(failureRate) || 0,
    0,
    100
  );
}

function calculateAnomalyScore({
  latency,
  expectedLatency,
  failureRate = 0,
}) {
  const latencyScore =
    calculateLatencyScore({
      latency,
      expectedLatency,
    });

  const failureScore =
    calculateFailureScore(
      failureRate
    );

  const score =
    Math.round(
      latencyScore * 0.7 +
        failureScore * 0.3
    );

  return clamp(
    score,
    0,
    100
  );
}

function getRiskLevel(score) {
  if (score >= 80) {
    return "Critical";
  }

  if (score >= 60) {
    return "High";
  }

  if (score >= 30) {
    return "Medium";
  }

  return "Low";
}

function analyzeExecution({
  latency,
  expectedLatency,
  failureRate = 0,
  baseline = null,
}) {
  if (
    baseline &&
    baseline.latency &&
    baseline.latency.sampleCount >
      0
  ) {
    const {
      calculateBaselineAnomaly,
    } = require("./baselineService");

    const baselineResult =
      calculateBaselineAnomaly({
        latency,
        baseline,
        failureRate,
      });

    if (baselineResult) {
      return {
        ...baselineResult,

        latency,

        expectedLatency,

        failureRate,

        latencyRatio:
          expectedLatency > 0
            ? Number(
                (
                  latency /
                  expectedLatency
                ).toFixed(2)
              )
            : null,
      };
    }
  }

  const anomalyScore =
    calculateAnomalyScore({
      latency,
      expectedLatency,
      failureRate,
    });

  const risk =
    getRiskLevel(
      anomalyScore
    );

  return {
    anomalyScore,

    risk,

    anomalous:
      anomalyScore >= 60,

    method:
      "configured-threshold",

    latencyRatio:
      expectedLatency > 0
        ? Number(
            (
              latency /
              expectedLatency
            ).toFixed(2)
          )
        : null,

    latency,

    expectedLatency,

    failureRate,
  };
}

module.exports = {
  calculateAnomalyScore,
  getRiskLevel,
  analyzeExecution,
};