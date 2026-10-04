const express = require("express");

const {
  runExecution,
  getExecutions,
  getExecutionById,
} = require("../controllers/executionController");

const router =
  express.Router();

router.get(
  "/",
  getExecutions
);

router.get(
  "/:executionId",
  getExecutionById
);

router.post(
  "/:workflowId/run",
  runExecution
);

module.exports = router;