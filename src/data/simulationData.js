
export const workflowSteps = [
  {
    id: 1,
    name: "Receive Payment Request",
    service: "Payment Gateway",
    duration: "120ms",
  },
  {
    id: 2,
    name: "Validate Transaction",
    service: "Validation Service",
    duration: "85ms",
  },
  {
    id: 3,
    name: "Update Database",
    service: "Database",
    duration: "150ms",
  },
  {
    id: 4,
    name: "Send Confirmation",
    service: "Notification Service",
    duration: "90ms",
  },
];

export const simulationScenarios = {
  normal: {
    status: "success",
    title: "Execution completed successfully",
    description:
      "All workflow steps executed within their expected thresholds.",
    latency: 445,
    failureRate: "0%",
    anomalyScore: 4,
    risk: "Low",
    events: [
      "Payment request received",
      "Transaction validated",
      "Database updated",
      "Confirmation sent successfully",
    ],
    recommendation:
      "No action required. Continue monitoring the workflow.",
  },

  failure: {
    status: "failure",
    title: "Workflow anomaly detected!",
    description:
      "Database response latency exceeded the configured threshold.",
    latency: 2840,
    failureRate: "32%",
    anomalyScore: 94,
    risk: "Critical",
    events: [
      "Payment request received",
      "Transaction validated",
      "Database response timeout",
      "Confirmation delivery blocked",
    ],
    recommendation:
      "Enable the configured database failover, retry the failed database operation with exponential backoff, and verify transaction consistency before resuming downstream actions.",
  },
};