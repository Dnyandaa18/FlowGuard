import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  LoaderCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import WorkflowCard from "../components/WorkflowCard";

import { getWorkflows } from "../services/api";

function Workflows({ onNavigate }) {
  const [workflows, setWorkflows] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadWorkflows = async () => {
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

  useEffect(() => {
    loadWorkflows();
  }, []);

  const filteredWorkflows =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return workflows.filter(
        (workflow) => {
          const matchesSearch =
            !query ||
            workflow.name
              .toLowerCase()
              .includes(query) ||
            workflow.description
              ?.toLowerCase()
              .includes(query);

          const matchesFilter =
            filter === "all" ||
            (filter ===
              "healthy" &&
              workflow.status ===
                "healthy") ||
            (filter ===
              "attention" &&
              workflow.status !==
                "healthy");

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      workflows,
      search,
      filter,
    ]);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span>
            WORKFLOW CENTER
          </div>

          <h1>
            Your Workflows
          </h1>

          <p>
            Monitor, protect and manage
            your automated processes.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            onNavigate("create")
          }
        >
          <Plus size={17} />
          Create Workflow
        </button>
      </div>

      <div className="workflow-toolbar">
        <div className="large-search">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search workflows..."
          />
        </div>

        <button
          className={`filter-btn ${
            filter === "all"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("all")
          }
        >
          All workflows
        </button>

        <button
          className={`filter-btn ${
            filter === "healthy"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("healthy")
          }
        >
          Healthy
        </button>

        <button
          className={`filter-btn ${
            filter ===
            "attention"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter(
              "attention"
            )
          }
        >
          Needs attention
        </button>
      </div>

      {loading && (
        <div className="page-state">
          <LoaderCircle
            size={24}
            className="spin"
          />

          <span>
            Loading workflows...
          </span>
        </div>
      )}

      {!loading && error && (
        <div className="page-state error">
          <AlertTriangle
            size={24}
          />

          <div>
            <strong>
              Unable to load workflows
            </strong>

            <p>{error}</p>
          </div>

          <button
            className="reset-btn"
            onClick={
              loadWorkflows
            }
          >
            <RefreshCw
              size={15}
            />
            Retry
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        filteredWorkflows.length ===
          0 && (
          <div className="page-state">
            <Search size={24} />

            <div>
              <strong>
                No workflows found
              </strong>

              <p>
                Try changing your search
                or filter.
              </p>
            </div>
          </div>
        )}

      {!loading &&
        !error &&
        filteredWorkflows.length >
          0 && (
          <div className="workflow-grid full">
            {filteredWorkflows.map(
              (workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                />
              )
            )}
          </div>
        )}
    </>
  );
}

export default Workflows;