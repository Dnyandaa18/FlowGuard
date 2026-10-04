const express = require("express");
const cors = require("cors");

const workflowRoutes = require("./routes/workflowRoutes");
const executionRoutes = require("./routes/executionRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const {
  getDatabase,
} = require("./config/database");

app.get("/api/health", (req, res) => {
  try {
    getDatabase();

    res.json({
      success: true,
      message:
        "FlowGuard API is running",
      database:
        "connected",
      timestamp:
        new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      message:
        "FlowGuard API database is unavailable",
      database:
        "disconnected",
      timestamp:
        new Date().toISOString(),
    });
  }
});

app.use(
  "/api/workflows",
  workflowRoutes
);

app.use(
  "/api/executions",
  executionRoutes
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

module.exports = app;