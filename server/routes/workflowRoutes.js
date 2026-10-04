const express = require("express");

const {
  getWorkflows,
  getWorkflowById,
  createWorkflow,
} = require("../controllers/workflowController");

const router = express.Router();

router.get("/", getWorkflows);

router.get("/:id", getWorkflowById);

router.post("/", createWorkflow);

module.exports = router;