const express = require("express");
const cors = require("cors");

const workflowRoutes = require("./routes/workflowRoutes");
const executionRoutes = require("./routes/executionRoutes");
const baselineRoutes =
  require("./routes/baselineRoutes");
const app = express();

const configuredOrigin =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isConfiguredOrigin =
        origin === configuredOrigin;

      const isFlowGuardVercelOrigin =
        /^https:\/\/flow-guard(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(
          origin
        );

      const isLocalOrigin =
        /^http:\/\/(localhost|127\.0\.0\.1):5173$/i.test(
          origin
        );

      if (
        isConfiguredOrigin ||
        isFlowGuardVercelOrigin ||
        isLocalOrigin
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS origin not allowed")
      );
    },
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
app.use(
  "/api/baselines",
  baselineRoutes
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

module.exports = app;