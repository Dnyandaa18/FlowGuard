function round(value, decimals = 2) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(
    value.toFixed(decimals)
  );
}

function calculateMean(values) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + value,
    0
  );

  return total / values.length;
}

function calculateVariance(
  values,
  mean
) {
  if (!values.length) {
    return 0;
  }

  const squaredDifferences =
    values.map(
      (value) =>
        Math.pow(
          value - mean,
          2
        )
    );

  return (
    squaredDifferences.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}

function calculatePercentile(
  values,
  percentile
) {
  if (!values.length) {
    return 0;
  }

  const sorted = [
    ...values,
  ].sort(
    (a, b) => a - b
  );

  const index =
    (sorted.length - 1) *
    percentile;

  const lower =
    Math.floor(index);

  const upper =
    Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const weight =
    index - lower;

  return (
    sorted[lower] +
    (sorted[upper] -
      sorted[lower]) *
      weight
  );
}

function calculateStatistics(
  values
) {
  const cleanValues =
    values
      .map(Number)
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0
      );

  if (!cleanValues.length) {
    return {
      sampleCount: 0,
      average: 0,
      variance: 0,
      standardDeviation: 0,
      minimum: 0,
      maximum: 0,
      p95: 0,
    };
  }

  const average =
    calculateMean(
      cleanValues
    );

  const variance =
    calculateVariance(
      cleanValues,
      average
    );

  return {
    sampleCount:
      cleanValues.length,

    average:
      round(average),

    variance:
      round(variance),

    standardDeviation:
      round(
        Math.sqrt(
          variance
        )
      ),

    minimum:
      round(
        Math.min(
          ...cleanValues
        )
      ),

    maximum:
      round(
        Math.max(
          ...cleanValues
        )
      ),

    p95:
      round(
        calculatePercentile(
          cleanValues,
          0.95
        )
      ),
  };
}

function buildServiceBaselines(
  executions
) {
  const serviceSamples =
    {};

  executions.forEach(
    (execution) => {
      if (
        execution.status !==
        "completed"
      ) {
        return;
      }

      if (
        !Array.isArray(
          execution.steps
        )
      ) {
        return;
      }

      execution.steps.forEach(
        (step) => {
          const service =
            step.service;

          const latency =
            Number(
              step.actualLatency
            );

          if (
            !service ||
            !Number.isFinite(
              latency
            )
          ) {
            return;
          }

          if (
            !serviceSamples[
              service
            ]
          ) {
            serviceSamples[
              service
            ] = [];
          }

          serviceSamples[
            service
          ].push(latency);
        }
      );
    }
  );

  return Object.entries(
    serviceSamples
  ).map(
    ([
      service,
      values,
    ]) => ({
      service,
      ...calculateStatistics(
        values
      ),
    })
  );
}

function buildWorkflowBaseline(
  workflow,
  executions
) {
  const successfulExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "completed"
    );

  const failedExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "failed"
    );

  const latencySamples =
    successfulExecutions
      .map(
        (execution) =>
          Number(
            execution.latency
          )
      )
      .filter(
        (latency) =>
          Number.isFinite(
            latency
          )
      );

  const latency =
    calculateStatistics(
      latencySamples
    );

  const totalExecutions =
    executions.length;

  const failureRate =
    totalExecutions > 0
      ? round(
          (failedExecutions.length /
            totalExecutions) *
            100,
          1
        )
      : 0;

  const minimumSamplesRequired =
    5;

  return {
    workflowId:
      workflow.id,

    workflowName:
      workflow.name,

    learningStatus:
      latency.sampleCount >=
      minimumSamplesRequired
        ? "learned"
        : "learning",

    minimumSamplesRequired,

    totalExecutions,

    successfulExecutions:
      successfulExecutions.length,

    failedExecutions:
      failedExecutions.length,

    failureRate,

    latency,

    services:
      buildServiceBaselines(
        executions
      ),

    generatedAt:
      new Date(),
  };
}

function calculateBaselineAnomaly(
  {
    latency,
    baseline,
    failureRate = 0,
  }
) {
  if (
    !baseline ||
    baseline.latency
      .sampleCount === 0
  ) {
    return null;
  }

  const average =
    baseline.latency
      .average;

  const standardDeviation =
    baseline.latency
      .standardDeviation;

  const deviation =
    average > 0
      ? latency / average
      : 1;

  let zScore = 0;

  if (
    standardDeviation > 0
  ) {
    zScore =
      (latency - average) /
      standardDeviation;
  }

  const absoluteZScore =
    Math.abs(zScore);

  let latencyScore;

  if (
    absoluteZScore >= 3
  ) {
    latencyScore = 95;
  } else if (
    absoluteZScore >= 2
  ) {
    latencyScore = 80;
  } else if (
    absoluteZScore >= 1.5
  ) {
    latencyScore = 65;
  } else if (
    absoluteZScore >= 1
  ) {
    latencyScore = 45;
  } else if (
    deviation >= 1.25
  ) {
    latencyScore = 30;
  } else {
    latencyScore = 10;
  }

  const failureScore =
    Math.min(
      Math.max(
        Number(
          failureRate
        ),
        0
      ),
      100
    );

  const anomalyScore =
    Math.round(
      latencyScore * 0.7 +
        failureScore * 0.3
    );

  let risk = "Low";

  if (
    anomalyScore >= 80
  ) {
    risk = "Critical";
  } else if (
    anomalyScore >= 60
  ) {
    risk = "High";
  } else if (
    anomalyScore >= 30
  ) {
    risk = "Medium";
  }

  return {
    anomalyScore,

    risk,

    anomalous:
      anomalyScore >= 60,

    method:
      "historical-baseline",

    baselineAverage:
      average,

    baselineStandardDeviation:
      standardDeviation,

    deviationRatio:
      round(
        deviation,
        2
      ),

    zScore:
      round(
        zScore,
        2
      ),
  };
}

module.exports = {
  calculateStatistics,
  buildWorkflowBaseline,
  calculateBaselineAnomaly,
};