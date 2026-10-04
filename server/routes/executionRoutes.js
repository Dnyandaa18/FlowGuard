const express = require("express");

const {
  runExecution,
} = require("../controllers/executionController");

const router = express.Router();

router.post(
  "/:workflowId/run",
  runExecution
);

module.exports = router;