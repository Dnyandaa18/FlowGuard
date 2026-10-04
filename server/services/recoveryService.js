function generateRecoveryRecommendation({
  risk,
  service,
  latency,
  failureRate,
}) {
  if (risk === "Critical") {
    return {
      priority: "critical",

      title: `${service} requires immediate attention`,

      explanation:
        `The workflow is showing abnormal behavior with ${latency}ms latency and a ${failureRate}% failure rate.`,

      actions: [
        "Activate configured failover",
        "Retry the failed operation with exponential backoff",
        "Verify transaction consistency",
        "Resume downstream workflow only after validation",
      ],
    };
  }

  if (risk === "High") {
    return {
      priority: "high",

      title: `${service} is showing elevated risk`,

      explanation:
        "Execution behavior is significantly above the expected operating range.",

      actions: [
        "Increase monitoring frequency",
        "Inspect recent service errors",
        "Retry affected operations",
      ],
    };
  }

  if (risk === "Medium") {
    return {
      priority: "medium",

      title: `${service} requires monitoring`,

      explanation:
        "The workflow is behaving differently from its normal baseline.",

      actions: [
        "Continue monitoring",
        "Inspect latency trend",
      ],
    };
  }

  return {
    priority: "low",

    title: "Workflow operating normally",

    explanation:
      "No significant abnormal behavior was detected.",

    actions: [
      "Continue normal monitoring",
    ],
  };
}

module.exports = {
  generateRecoveryRecommendation,
};