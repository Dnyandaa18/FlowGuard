import { useState } from "react";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Rocket,
  ShieldCheck,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { createWorkflow } from "../services/api";

const defaultSteps = [
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
];

function CreateWorkflow({ onNavigate }) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [steps, setSteps] =
    useState(defaultSteps);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const updateStep = (
    id,
    field,
    value
  ) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id
          ? {
              ...step,
              [field]: value,
            }
          : step
      )
    );
  };

  const addStep = () => {
    const nextId =
      steps.length === 0
        ? 1
        : Math.max(
            ...steps.map(
              (step) => step.id
            )
          ) + 1;

    setSteps((currentSteps) => [
      ...currentSteps,
      {
        id: nextId,
        name: "",
        service: "",
        expectedLatency: 200,
      },
    ]);
  };

  const removeStep = (id) => {
    setSteps((currentSteps) =>
      currentSteps.filter(
        (step) => step.id !== id
      )
    );
  };

  const validateForm = () => {
    if (!name.trim()) {
      return "Please enter a workflow name.";
    }

    if (steps.length === 0) {
      return "Please add at least one workflow step.";
    }

    for (
      let index = 0;
      index < steps.length;
      index += 1
    ) {
      const step = steps[index];

      if (!step.name.trim()) {
        return `Please enter a name for step ${
          index + 1
        }.`;
      }

      if (!step.service.trim()) {
        return `Please enter a service for step ${
          index + 1
        }.`;
      }

      const latency = Number(
        step.expectedLatency
      );

      if (
        !Number.isFinite(latency) ||
        latency <= 0
      ) {
        return `Step ${
          index + 1
        } must have a valid expected latency.`;
      }
    }

    return null;
  };

  const handleDeploy = async () => {
    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response =
        await createWorkflow({
          name: name.trim(),
          description:
            description.trim(),
          steps: steps.map((step) => ({
            name: step.name.trim(),
            service:
              step.service.trim(),
            expectedLatency:
              Number(
                step.expectedLatency
              ),
          })),
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to create workflow."
        );
      }

      setSuccess(
        `Workflow "${response.workflow.name}" was created successfully.`
      );

      setTimeout(() => {
        onNavigate("workflows");
      }, 900);
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

  return (
    <div>
      <button
        className="back-btn"
        onClick={() =>
          onNavigate("workflows")
        }
      >
        <ArrowLeft size={15} />
        Back to Workflows
      </button>

      <div className="create-header">
        <div className="eyebrow">
          <span></span>
          WORKFLOW BUILDER
        </div>

        <h1>
          Create Protected Workflow
        </h1>

        <p>
          Define your workflow and let
          FlowGuard monitor its execution
          behavior.
        </p>
      </div>

      {error && (
        <div className="form-message error">
          <AlertTriangle size={18} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="form-message success">
          <CheckCircle2 size={18} />

          <span>{success}</span>
        </div>
      )}

      <div className="create-layout">
        <div className="create-main">
          <div className="form-panel">
            <div className="form-heading">
              <div className="step-number">
                01
              </div>

              <div>
                <h2>
                  Workflow Information
                </h2>

                <p>
                  Give your workflow an
                  identity.
                </p>
              </div>
            </div>

            <label htmlFor="workflow-name">
              Workflow Name
            </label>

            <input
              id="workflow-name"
              className="form-input"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. Payment Processing"
              disabled={loading}
            />

            <label htmlFor="workflow-description">
              Description
            </label>

            <textarea
              id="workflow-description"
              className="form-input textarea"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe what this workflow does..."
              disabled={loading}
            />
          </div>

          <div className="form-panel">
            <div className="form-heading">
              <div className="step-number">
                02
              </div>

              <div>
                <h2>
                  Workflow Steps
                </h2>

                <p>
                  Define each service and
                  its expected latency.
                </p>
              </div>
            </div>

            {steps.map(
              (step, index) => (
                <div
                  className="workflow-step editable"
                  key={step.id}
                >
                  <div className="step-index">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="step-fields">
                    <input
                      className="form-input"
                      value={step.name}
                      onChange={(event) =>
                        updateStep(
                          step.id,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Step name"
                      disabled={loading}
                    />

                    <input
                      className="form-input"
                      value={step.service}
                      onChange={(event) =>
                        updateStep(
                          step.id,
                          "service",
                          event.target.value
                        )
                      }
                      placeholder="Service name"
                      disabled={loading}
                    />

                    <div className="latency-input">
                      <input
                        className="form-input"
                        type="number"
                        min="1"
                        value={
                          step.expectedLatency
                        }
                        onChange={(event) =>
                          updateStep(
                            step.id,
                            "expectedLatency",
                            event.target.value
                          )
                        }
                        placeholder="200"
                        disabled={loading}
                      />

                      <span>
                        ms
                      </span>
                    </div>
                  </div>

                  {steps.length > 1 && (
                    <button
                      className="delete-btn"
                      onClick={() =>
                        removeStep(
                          step.id
                        )
                      }
                      title="Remove step"
                      disabled={
                        loading
                      }
                    >
                      <Trash2
                        size={15}
                      />
                    </button>
                  )}
                </div>
              )
            )}

            <button
              className="add-step-btn"
              onClick={addStep}
              disabled={loading}
            >
              <Plus size={15} />
              Add Workflow Step
            </button>
          </div>

          <button
            className="deploy-btn"
            onClick={handleDeploy}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle
                size={17}
                className="spin"
              />
            ) : (
              <Rocket size={17} />
            )}

            {loading
              ? "Deploying..."
              : "Deploy Protected Workflow"}
          </button>
        </div>

        <div className="protection-preview">
          <div className="preview-icon">
            <ShieldCheck size={25} />
          </div>

          <h2>
            FlowGuard Protection
          </h2>

          <p>
            Once deployed, FlowGuard
            continuously analyzes workflow
            execution behavior.
          </p>

          <div className="protection-list">
            <div>
              <span>✓</span>
              Execution monitoring
            </div>

            <div>
              <span>✓</span>
              Anomaly detection
            </div>

            <div>
              <span>✓</span>
              Failure analysis
            </div>

            <div>
              <span>✓</span>
              Recovery recommendations
            </div>

            <div>
              <span>✓</span>
              Workflow health tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkflow;