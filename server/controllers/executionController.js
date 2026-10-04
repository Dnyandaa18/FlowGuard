const workflows = require("../data/workflows");

const {
  analyzeExecution,
} = require("../services/anomalyService");

const {
  generateRecoveryRecommendation,
} = require("../services/recoveryService");

function runExecution(req, res) {
  const { workflowId } = req.params;

  const workflow = workflows.find(
    (item) => item.id === workflowId
  );

  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: "Workflow not found",
    });
  }

  const {
    scenario = "normal",
  } = req.body;

  const isFailure =
    scenario === "failure";

  const targetStep =
    workflow.steps[2] || workflow.steps[0];

  const latency = isFailure
    ? targetStep.expectedLatency * 8
    : targetStep.expectedLatency * 0.8;

  const failureRate = isFailure
    ? 32
    : 0;

  const analysis = analyzeExecution({
    latency,
    expectedLatency:
      targetStep.expectedLatency,
    failureRate,
  });

  const recovery =
    generateRecoveryRecommendation({
      risk: analysis.risk,
      service: targetStep.service,
      latency,
      failureRate,
    });

  const stepResults =
    workflow.steps.map((step, index) => {
      if (isFailure && index === 2) {
        return {
          ...step,
          status: "failed",
          actualLatency: latency,
        };
      }

      return {
        ...step,
        status: "completed",
        actualLatency:
          Math.round(
            step.expectedLatency * 0.8
          ),
      };
    });

  const execution = {
    executionId: `exec_${Date.now()}`,

    workflowId: workflow.id,

    workflowName: workflow.name,

    status: isFailure
      ? "failed"
      : "completed",

    startedAt: new Date().toISOString(),

    completedAt:
      new Date().toISOString(),

    latency,

    failureRate,

    anomaly: analysis,

    recovery,

    steps: stepResults,
  };

  res.json({
    success: true,
    execution,
  });
}

module.exports = {
  runExecution,
};