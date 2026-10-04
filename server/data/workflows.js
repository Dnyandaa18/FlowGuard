const workflows = [
  {
    id: "wf_payment",
    name: "Payment Processing",
    description: "Stripe → Database → Email",
    status: "healthy",
    successRate: 99,
    executions: 12400,

    steps: [
      {
        id: 1,
        name: "Receive Payment Request",
        service: "Payment Gateway",
        expectedLatency: 200,
      },
      {
        id: 2,
        name: "Validate Transaction",
        service: "Validation Service",
        expectedLatency: 150,
      },
      {
        id: 3,
        name: "Update Database",
        service: "Database",
        expectedLatency: 300,
      },
      {
        id: 4,
        name: "Send Confirmation",
        service: "Notification Service",
        expectedLatency: 200,
      },
    ],
  },

  {
    id: "wf_onboarding",
    name: "User Onboarding",
    description: "Signup → Verification → CRM",
    status: "healthy",
    successRate: 96,
    executions: 8700,

    steps: [
      {
        id: 1,
        name: "User Signup",
        service: "Authentication",
        expectedLatency: 200,
      },
      {
        id: 2,
        name: "Email Verification",
        service: "Email Service",
        expectedLatency: 500,
      },
      {
        id: 3,
        name: "Create CRM Profile",
        service: "CRM",
        expectedLatency: 300,
      },
    ],
  },

  {
    id: "wf_orders",
    name: "Order Fulfillment",
    description: "Order → Inventory → Shipping",
    status: "warning",
    successRate: 82,
    executions: 6200,

    steps: [
      {
        id: 1,
        name: "Receive Order",
        service: "Order Service",
        expectedLatency: 200,
      },
      {
        id: 2,
        name: "Check Inventory",
        service: "Inventory Service",
        expectedLatency: 300,
      },
      {
        id: 3,
        name: "Create Shipment",
        service: "Shipping Service",
        expectedLatency: 500,
      },
    ],
  },
];

module.exports = workflows;