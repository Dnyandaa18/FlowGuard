import {
  GitBranch,
  Activity,
  ShieldAlert,
  Zap,
  ArrowUpRight,
} from "lucide-react";

import StatCard from "../StatCard";
import WorkflowCard from "../WorkflowCard";
import AlertItem from "../components/AlertItem";

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
];

const alerts = [
  {
    type: "critical",
    title: "Payment Processing anomaly detected",
    description:
      "Failure rate increased by 18% in the last 10 minutes.",
    time: "2 minutes ago",
  },
  {
    type: "warning",
    title: "Order Fulfillment latency spike",
    description:
      "Average execution time is above the configured threshold.",
    time: "14 minutes ago",
  },
  {
    type: "success",
    title: "Database connection recovered",
    description:
      "FlowGuard automatically verified system recovery.",
    time: "31 minutes ago",
  },
];

function Dashboard({ onNavigate }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            LIVE MONITORING
          </div>

          <h1>Good evening, Developer.</h1>

          <p>
            Here's what's happening across your workflows.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => onNavigate("create")}
        >
          <Zap size={17} />
          New Workflow
        </button>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Active Workflows"
          value="8"
          description="+2 this week"
          icon={<GitBranch size={20} />}
          type="purple"
        />

        <StatCard
          title="Successful Runs"
          value="98.4%"
          description="+1.2% from last week"
          icon={<Activity size={20} />}
          type="green"
        />

        <StatCard
          title="Active Incidents"
          value="3"
          description="2 require attention"
          icon={<ShieldAlert size={20} />}
          type="red"
        />

        <StatCard
          title="Automated Recoveries"
          value="47"
          description="Saved 6.2 hrs this week"
          icon={<Zap size={20} />}
          type="yellow"
        />
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Protected Workflows</h2>
            <p>Real-time health monitoring</p>
          </div>

          <button
            className="text-btn"
            onClick={() => onNavigate("workflows")}
          >
            View all
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.name}
              workflow={workflow}
            />
          ))}
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="section-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest events detected by FlowGuard</p>
            </div>
          </div>

          <div className="activity-chart">
            <div className="chart-labels">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart">
              <div className="chart-line line-one"></div>
              <div className="chart-line line-two"></div>

              <div className="chart-bars">
                {[42, 55, 48, 73, 62, 80, 66, 91, 75, 84, 70, 95].map(
                  (height, index) => (
                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      key={index}
                    ></div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <h2>Security Alerts</h2>
              <p>Things that need your attention</p>
            </div>

            <span className="alert-count">3</span>
          </div>

          <div className="alerts">
            {alerts.map((alert, index) => (
              <AlertItem
                key={index}
                alert={alert}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;