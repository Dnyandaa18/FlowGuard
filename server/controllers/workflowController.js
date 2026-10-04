const {
  getWorkflowsCollection,
} = require("../config/database");

function normalizeStep(
  step,
  index
) {
  const name =
    typeof step.name === "string"
      ? step.name.trim()
      : "";

  const service =
    typeof step.service === "string"
      ? step.service.trim()
      : "";

  const expectedLatency =
    Number(
      step.expectedLatency
    );

  return {
    id: index + 1,
    name,
    service,
    expectedLatency,
  };
}

function validateSteps(steps) {
  if (
    !Array.isArray(steps) ||
    steps.length === 0
  ) {
    return "At least one workflow step is required.";
  }

  for (
    let index = 0;
    index < steps.length;
    index += 1
  ) {
    const step = steps[index];

    if (
      !step ||
      typeof step.name !==
        "string" ||
      !step.name.trim()
    ) {
      return `Step ${
        index + 1
      } must have a name.`;
    }

    if (
      typeof step.service !==
        "string" ||
      !step.service.trim()
    ) {
      return `Step ${
        index + 1
      } must have a service.`;
    }

    const expectedLatency =
      Number(
        step.expectedLatency
      );

    if (
      !Number.isFinite(
        expectedLatency
      ) ||
      expectedLatency <= 0
    ) {
      return `Step ${
        index + 1
      } must have a valid expected latency greater than 0.`;
    }
  }

  return null;
}

function serializeWorkflow(
  workflow
) {
  if (!workflow) {
    return null;
  }

  const {
    _id,
    successfulExecutions = 0,
    failedExecutions = 0,
    ...rest
  } = workflow;

  const totalExecutions =
    Number(
      successfulExecutions
    ) +
    Number(
      failedExecutions
    );

  const successRate =
    totalExecutions > 0
      ? Number(
          (
            (successfulExecutions /
              totalExecutions) *
            100
          ).toFixed(1)
        )
      : 100;

  return {
    ...rest,
    executions:
      totalExecutions,
    successRate,
    status:
      successRate >= 95
        ? "healthy"
        : "warning",
  };
}

async function getWorkflows(
  req,
  res
) {
  try {
    const collection =
      getWorkflowsCollection();

    const workflows =
      await collection
        .find({})
        .sort({
          createdAt: 1,
        })
        .toArray();

    res.json({
      success: true,
      count:
        workflows.length,
      workflows:
        workflows.map(
          serializeWorkflow
        ),
    });
  } catch (error) {
    console.error(
      "getWorkflows error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load workflows.",
    });
  }
}

async function getWorkflowById(
  req,
  res
) {
  try {
    const collection =
      getWorkflowsCollection();

    const workflow =
      await collection.findOne({
        id: req.params.id,
      });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found",
      });
    }

    res.json({
      success: true,
      workflow:
        serializeWorkflow(
          workflow
        ),
    });
  } catch (error) {
    console.error(
      "getWorkflowById error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load workflow.",
    });
  }
}

async function createWorkflow(
  req,
  res
) {
  try {
    const {
      name,
      description = "",
      steps,
    } = req.body || {};

    if (
      typeof name !==
        "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Workflow name is required.",
      });
    }

    const validationError =
      validateSteps(steps);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message:
          validationError,
      });
    }

    const collection =
      getWorkflowsCollection();

    const workflow = {
      id: `wf_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      name: name.trim(),

      description:
        typeof description ===
        "string"
          ? description.trim()
          : "",

      status: "healthy",

      successRate: 100,

      executions: 0,

      successfulExecutions: 0,

      failedExecutions: 0,

      steps:
        steps.map(
          normalizeStep
        ),

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    };

    await collection.insertOne(
      workflow
    );

    res.status(201).json({
      success: true,
      message:
        "Workflow created successfully",
      workflow:
        serializeWorkflow(
          workflow
        ),
    });
  } catch (error) {
    console.error(
      "createWorkflow error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create workflow.",
    });
  }
}

module.exports = {
  getWorkflows,
  getWorkflowById,
  createWorkflow,
};