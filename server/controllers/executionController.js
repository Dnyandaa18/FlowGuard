const {
  getWorkflowsCollection,
  getExecutionsCollection,
} = require("../config/database");

const {
  analyzeExecution,
} = require("../services/anomalyService");

const {
  generateRecoveryRecommendation,
} = require("../services/recoveryService");

function buildEvents(
  workflow,
  targetStep,
  isFailure
) {
  const events = [];

  workflow.steps.forEach(
    (step, index) => {
      if (
        isFailure &&
        step.id ===
          targetStep.id
      ) {
        events.push(
          `${step.name} response timeout detected`
        );

        return;
      }

      if (
        isFailure &&
        index >
          workflow.steps.findIndex(
            (item) =>
              item.id ===
              targetStep.id
          )
      ) {
        events.push(
          `${step.name} execution blocked`
        );

        return;
      }

      events.push(
        `${step.name} completed successfully`
      );
    }
  );

  return events;
}

function serializeExecution(
  execution
) {
  if (!execution) {
    return null;
  }

  const {
    _id,
    ...rest
  } = execution;

  return rest;
}

async function runExecution(
  req,
  res
) {
  try {
    const {
      workflowId,
    } = req.params;

    const workflowCollection =
      getWorkflowsCollection();

    const executionCollection =
      getExecutionsCollection();

    const workflow =
      await workflowCollection.findOne({
        id: workflowId,
      });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found",
      });
    }

    const scenario =
      req.body?.scenario ||
      "normal";

    if (
      ![
        "normal",
        "failure",
      ].includes(scenario)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid scenario. Use 'normal' or 'failure'.",
      });
    }

    if (
      !workflow.steps ||
      workflow.steps.length ===
        0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Workflow has no executable steps.",
      });
    }

    const isFailure =
      scenario === "failure";

    const targetStep =
      workflow.steps.find(
        (step) =>
          step.service
            ?.toLowerCase()
            .includes(
              "database"
            )
      ) ||
      workflow.steps[
        Math.min(
          2,
          workflow.steps.length -
            1
        )
      ] ||
      workflow.steps[0];

    const targetStepIndex =
      workflow.steps.findIndex(
        (step) =>
          step.id ===
          targetStep.id
      );

    const expectedLatency =
      Number(
        targetStep.expectedLatency
      );

    const latency = isFailure
      ? expectedLatency * 12
      : Math.round(
          expectedLatency * 0.8
        );

    const failureRate =
      isFailure ? 50 : 0;

    const anomaly =
      analyzeExecution({
        latency,
        expectedLatency,
        failureRate,
      });

    const recovery =
      generateRecoveryRecommendation(
        {
          risk: anomaly.risk,
          service:
            targetStep.service,
          latency,
          failureRate,
        }
      );

    const stepResults =
      workflow.steps.map(
        (step, index) => {
          if (
            isFailure &&
            index ===
              targetStepIndex
          ) {
            return {
              ...step,
              status: "failed",
              actualLatency:
                latency,
            };
          }

          if (
            isFailure &&
            index >
              targetStepIndex
          ) {
            return {
              ...step,
              status: "pending",
              actualLatency:
                null,
            };
          }

          return {
            ...step,
            status: "completed",
            actualLatency:
              Math.round(
                Number(
                  step.expectedLatency
                ) * 0.8
              ),
          };
        }
      );

    const events =
      buildEvents(
        workflow,
        targetStep,
        isFailure
      );

    const startedAt =
      new Date();

    const completedAt =
      new Date();

    const execution = {
      executionId:
        `exec_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 7)}`,

      workflowId:
        workflow.id,

      workflowName:
        workflow.name,

      scenario,

      status: isFailure
        ? "failed"
        : "completed",

      startedAt,

      completedAt,

      latency,

      expectedLatency,

      failureRate,

      anomaly,

      recovery,

      events,

      steps:
        stepResults,

      createdAt:
        new Date(),
    };

    await executionCollection.insertOne(
      execution
    );

    const updateFields =
      isFailure
        ? {
            $inc: {
              failedExecutions: 1,
            },
          }
        : {
            $inc: {
              successfulExecutions: 1,
            },
          };

    await workflowCollection.updateOne(
      {
        id: workflow.id,
      },
      {
        ...updateFields,

        $set: {
          updatedAt:
            new Date(),
        },
      }
    );

    return res.json({
      success: true,
      execution:
        serializeExecution(
          execution
        ),
    });
  } catch (error) {
    console.error(
      "runExecution error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to execute workflow.",
    });
  }
}

async function getExecutions(
  req,
  res
) {
  try {
    const {
      workflowId,
    } = req.query;

    const collection =
      getExecutionsCollection();

    const query =
      workflowId
        ? {
            workflowId,
          }
        : {};

    const executions =
      await collection
        .find(query)
        .sort({
          startedAt: -1,
        })
        .limit(100)
        .toArray();

    res.json({
      success: true,
      count:
        executions.length,
      executions:
        executions.map(
          serializeExecution
        ),
    });
  } catch (error) {
    console.error(
      "getExecutions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load execution history.",
    });
  }
}

async function getExecutionById(
  req,
  res
) {
  try {
    const collection =
      getExecutionsCollection();

    const execution =
      await collection.findOne({
        executionId:
          req.params.executionId,
      });

    if (!execution) {
      return res.status(404).json({
        success: false,
        message:
          "Execution not found",
      });
    }

    res.json({
      success: true,
      execution:
        serializeExecution(
          execution
        ),
    });
  } catch (error) {
    console.error(
      "getExecutionById error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load execution.",
    });
  }
}

module.exports = {
  runExecution,
  getExecutions,
  getExecutionById,
};