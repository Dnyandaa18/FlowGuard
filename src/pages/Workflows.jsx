import { Plus, Search } from "lucide-react";
import WorkflowCard from "../components/WorkflowCard";

const workflows = [
  {
    name: "Payment Processing",
    description: "Stripe → Database → Email",
    success: 99,
    executions: "12.4K",
    status: "healthy",
    icon: "💳",
  },
  {
    name: "User Onboarding",
    description: "Signup → Verification → CRM",
    success: 96,
    executions: "8.7K",
    status: "healthy",
    icon: "👤",
  },
  {
    name: "Order Fulfillment",
    description: "Order → Inventory → Shipping",
    success: 82,
    executions: "6.2K",
    status: "warning",
    icon: "📦",
  },
  {
    name: "Email Campaign",
    description: "Trigger → Personalization → Send",
    success: 98,
    executions: "18.1K",
    status: "healthy",
    icon: "✉️",
  },
  {
    name: "Data Sync",
    description: "API → Transform → Warehouse",
    success: 94,
    executions: "5.8K",
    status: "healthy",
    icon: "🔄",
  },
  {
    name: "Customer Support",
    description: "Ticket → AI → Agent",
    success: 91,
    executions: "4.3K",
    status: "healthy",
    icon: "💬",
  },
];

function Workflows({ onNavigate }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            WORKFLOW CENTER
          </div>

          <h1>Your Workflows</h1>

          <p>
            Monitor, protect and manage your automated processes.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => onNavigate("create")}
        >
          <Plus size={17} />
          Create Workflow
        </button>
      </div>

      <div className="workflow-toolbar">
        <div className="large-search">
          <Search size={18} />
          <input placeholder="Search workflows..." />
        </div>

        <button className="filter-btn">All workflows</button>
        <button className="filter-btn">Healthy</button>
        <button className="filter-btn">Needs attention</button>
      </div>

      <div className="workflow-grid full">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.name}
            workflow={workflow}
          />
        ))}
      </div>
    </>
  );
}

export default Workflows;