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

  const scenario = req.body?.scenario || "normal";

  if (!["normal", "failure"].includes(scenario)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid scenario. Use 'normal' or 'failure'.",
    });
  }

  const isFailure = scenario === "failure";

  const targetStep =
    workflow.steps.find(
      (step) => step.id === 3
    ) || workflow.steps[0];

  const expectedLatency =
    targetStep.expectedLatency;

  const latency = isFailure
    ? expectedLatency * 8
    : Math.round(expectedLatency * 0.8);

  const failureRate = isFailure ? 32 : 0;

  const analysis = analyzeExecution({
    latency,
    expectedLatency,
    failureRate,
  });

  const recovery =
    generateRecoveryRecommendation({
      risk: analysis.risk,
      service: targetStep.service,
      latency,
      failureRate,
    });

  const stepResults = workflow.steps.map(
    (step) => {
      if (isFailure && step.id === targetStep.id) {
        return {
          ...step,
          status: "failed",
          actualLatency: latency,
        };
      }

      if (isFailure && step.id > targetStep.id) {
        return {
          ...step,
          status: "pending",
          actualLatency: null,
        };
      }

      return {
        ...step,
        status: "completed",
        actualLatency: Math.round(
          step.expectedLatency * 0.8
        ),
      };
    }
  );

  const now = new Date().toISOString();

  const execution = {
    executionId: `exec_${Date.now()}`,
    workflowId: workflow.id,
    workflowName: workflow.name,
    scenario,
    status: isFailure
      ? "failed"
      : "completed",
    startedAt: now,
    completedAt: now,
    latency,
    expectedLatency,
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