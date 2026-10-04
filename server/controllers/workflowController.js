const workflows = require("../data/workflows");

function getWorkflows(req, res) {
  res.json({
    success: true,
    count: workflows.length,
    workflows,
  });
}

function getWorkflowById(req, res) {
  const workflow = workflows.find(
    (item) => item.id === req.params.id
  );

  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: "Workflow not found",
    });
  }

  res.json({
    success: true,
    workflow,
  });
}

function createWorkflow(req, res) {
  const {
    name,
    description,
    steps,
  } = req.body;

  if (!name || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Workflow name and at least one step are required",
    });
  }

  const workflow = {
    id: `wf_${Date.now()}`,
    name: name.trim(),
    description: description || "",
    status: "healthy",
    successRate: 100,
    executions: 0,
    steps,
  };

  workflows.push(workflow);

  res.status(201).json({
    success: true,
    message: "Workflow created successfully",
    workflow,
  });
}

module.exports = {
  getWorkflows,
  getWorkflowById,
  createWorkflow,
};