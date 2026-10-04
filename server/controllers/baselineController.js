const {
  getWorkflowsCollection,
  getExecutionsCollection,
} = require("../config/database");

const {
  buildWorkflowBaseline,
} = require("../services/baselineService");

async function getWorkflowBaseline(
  req,
  res
) {
  try {
    const {
      workflowId,
    } = req.params;

    const workflows =
      getWorkflowsCollection();

    const executions =
      getExecutionsCollection();

    const workflow =
      await workflows.findOne({
        id: workflowId,
      });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found.",
      });
    }

    const history =
      await executions
        .find({
          workflowId,
        })
        .sort({
          startedAt: -1,
        })
        .limit(500)
        .toArray();

    const baseline =
      buildWorkflowBaseline(
        workflow,
        history
      );

    return res.json({
      success: true,
      baseline,
    });
  } catch (error) {
    console.error(
      "getWorkflowBaseline error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to calculate workflow baseline.",
    });
  }
}

module.exports = {
  getWorkflowBaseline,
};