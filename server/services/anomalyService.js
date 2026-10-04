function calculateAnomalyScore({
  latency,
  expectedLatency,
  failureRate = 0,
}) {
  if (
    !expectedLatency ||
    expectedLatency <= 0
  ) {
    return 0;
  }

  const latencyRatio =
    latency / expectedLatency;

  let latencyScore = 0;

  if (latencyRatio <= 1) {
    latencyScore = 5;
  } else if (latencyRatio <= 1.5) {
    latencyScore = 20;
  } else if (latencyRatio <= 2) {
    latencyScore = 40;
  } else if (latencyRatio <= 4) {
    latencyScore = 70;
  } else {
    latencyScore = 90;
  }

  const normalizedFailureRate =
    Math.min(Math.max(failureRate, 0), 100);

  const failureScore =
    normalizedFailureRate * 1.5;

  const score = Math.round(
    latencyScore * 0.7 +
    Math.min(failureScore, 100) * 0.3
  );

  return Math.min(score, 100);
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
}) {
  const anomalyScore =
    calculateAnomalyScore({
      latency,
      expectedLatency,
      failureRate,
    });

  const risk =
    getRiskLevel(anomalyScore);

  return {
    anomalyScore,
    risk,
    anomalous: anomalyScore >= 60,
  };
}

module.exports = {
  calculateAnomalyScore,
  getRiskLevel,
  analyzeExecution,
};