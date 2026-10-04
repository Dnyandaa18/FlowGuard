const express = require("express");

const {
  getWorkflowBaseline,
} = require("../controllers/baselineController");

const router =
  express.Router();

router.get(
  "/:workflowId",
  getWorkflowBaseline
);

module.exports = router;