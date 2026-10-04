import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GitBranch,
  Activity,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

import StatCard from "../components/StatCard";
import WorkflowCard from "../components/WorkflowCard";
import AlertItem from "../components/AlertItem";

import { getWorkflows } from "../services/api";

const alerts = [
  {
    type: "critical",
    title:
      "Payment Processing anomaly detected",
    description:
      "Failure rate increased by 18% in the last 10 minutes.",
    time: "2 minutes ago",
  },
  {
    type: "warning",
    title:
      "Order Fulfillment latency spike",
    description:
      "Average execution time is above the configured threshold.",
    time: "14 minutes ago",
  },
  {
    type: "success",
    title:
      "Database connection recovered",
    description:
      "FlowGuard automatically verified system recovery.",
    time: "31 minutes ago",
  },
];

function Dashboard({ onNavigate }) {
  const [workflows, setWorkflows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadWorkflows =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getWorkflows();

          if (!response.success) {
            throw new Error(
              response.message ||
                "Unable to load workflows."
            );
          }

          setWorkflows(
            response.workflows || []
          );
        } catch (err) {
          console.error(err);

          setError(
            err.message ||
              "Unable to connect to the FlowGuard API."
          );
        } finally {
          setLoading(false);
        }
      };

    loadWorkflows();
  }, []);

  const activeWorkflows =
    workflows.length;

  const totalExecutions =
    useMemo(
      () =>
        workflows.reduce(
          (total, workflow) =>
            total +
            Number(
              workflow.executions || 0
            ),
          0
        ),
      [workflows]
    );

  const weightedSuccessRate =
    useMemo(() => {
      if (
        totalExecutions === 0
      ) {
        return 100;
      }

      const weighted =
        workflows.reduce(
          (total, workflow) => {
            return (
              total +
              Number(
                workflow.successRate ||
                  0
              ) *
                Number(
                  workflow.executions ||
                    0
                )
            );
          },
          0
        );

      return (
        weighted /
        totalExecutions
      );
    }, [
      workflows,
      totalExecutions,
    ]);

  const displayedWorkflows =
    workflows.slice(0, 3);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            LIVE MONITORING
          </div>

          <h1>
            Good evening, Developer.
          </h1>

          <p>
            Here's what's happening
            across your workflows.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            onNavigate("create")
          }
        >
          <Zap size={17} />
          New Workflow
        </button>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Active Workflows"
          value={loading
            ? "..."
            : activeWorkflows}
          description={
            loading
              ? "Loading..."
              : "Protected workflows"
          }
          icon={
            <GitBranch size={20} />
          }
          type="purple"
        />

        <StatCard
          title="Successful Runs"
          value={
            loading
              ? "..."
              : `${weightedSuccessRate.toFixed(
                  1
                )}%`
          }
          description="Based on workflow execution data"
          icon={
            <Activity size={20} />
          }
          type="green"
        />

        <StatCard
          title="Active Incidents"
          value="3"
          description="2 require attention"
          icon={
            <ShieldAlert
              size={20}
            />
          }
          type="red"
        />

        <StatCard
          title="Automated Recoveries"
          value="47"
          description="Recovery engine activity"
          icon={
            <Zap size={20} />
          }
          type="yellow"
        />
      </section>

      {error && (
        <div className="form-message error">
          <AlertTriangle
            size={18}
          />

          <span>
            {error}
          </span>
        </div>
      )}

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>
              Protected Workflows
            </h2>

            <p>
              Real-time health monitoring
            </p>
          </div>

          <button
            className="text-btn"
            onClick={() =>
              onNavigate(
                "workflows"
              )
            }
          >
            View all
            <ArrowUpRight
              size={15}
            />
          </button>
        </div>

        {loading ? (
          <div className="page-state">
            <LoaderCircle
              size={22}
              className="spin"
            />

            Loading workflows...
          </div>
        ) : displayedWorkflows.length ===
          0 ? (
          <div className="page-state">
            <GitBranch size={24} />

            <div>
              <strong>
                No workflows yet
              </strong>

              <p>
                Create your first protected
                workflow.
              </p>
            </div>
          </div>
        ) : (
          <div className="workflow-grid">
            {displayedWorkflows.map(
              (workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                />
              )
            )}
          </div>
        )}
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="section-heading">
            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest events detected by
                FlowGuard
              </p>
            </div>
          </div>

          <div className="activity-chart">
            <div className="chart-labels">
              <span>
                100%
              </span>
              <span>
                75%
              </span>
              <span>
                50%
              </span>
              <span>
                25%
              </span>
              <span>
                0%
              </span>
            </div>

            <div className="chart">
              <div className="chart-line line-one"></div>
              <div className="chart-line line-two"></div>

              <div className="chart-bars">
                {[
                  42, 55, 48, 73,
                  62, 80, 66, 91,
                  75, 84, 70, 95,
                ].map(
                  (
                    height,
                    index
                  ) => (
                    <div
                      className="chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
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
              <h2>
                Security Alerts
              </h2>

              <p>
                Things that need your
                attention
              </p>
            </div>

            <span className="alert-count">
              3
            </span>
          </div>

          <div className="alerts">
            {alerts.map(
              (alert, index) => (
                <AlertItem
                  key={index}
                  alert={alert}
                />
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;