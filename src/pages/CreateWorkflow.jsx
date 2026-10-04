import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const defaultSteps = [
  {
    id: 1,
    name: "Receive Payment Request",
    service: "Payment Gateway",
  },
  {
    id: 2,
    name: "Validate Transaction",
    service: "Validation Service",
  },
  {
    id: 3,
    name: "Update Database",
    service: "Database",
  },
];

function CreateWorkflow({ onNavigate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [steps, setSteps] = useState(defaultSteps);

  const addStep = () => {
    const nextId = steps.length + 1;

    setSteps([
      ...steps,
      {
        id: nextId,
        name: `Workflow Step ${nextId}`,
        service: "Custom Service",
      },
    ]);
  };

  const removeStep = (id) => {
    setSteps(
      steps.filter((step) => step.id !== id)
    );
  };

  const handleDeploy = () => {
    if (!name.trim()) {
      alert("Please enter a workflow name.");
      return;
    }

    if (steps.length === 0) {
      alert("Please add at least one workflow step.");
      return;
    }

    alert(
      `Workflow "${name}" is ready for deployment.`
    );
  };

  return (
    <div>
      <button
        className="back-btn"
        onClick={() => onNavigate("workflows")}
      >
        <ArrowLeft size={15} />
        Back to Workflows
      </button>

      <div className="create-header">
        <div className="eyebrow">
          <span></span>
          WORKFLOW BUILDER
        </div>

        <h1>Create Protected Workflow</h1>

        <p>
          Define your workflow and let FlowGuard monitor
          its execution behavior.
        </p>
      </div>

      <div className="create-layout">
        <div className="create-main">
          <div className="form-panel">
            <div className="form-heading">
              <div className="step-number">
                01
              </div>

              <div>
                <h2>Workflow Information</h2>

                <p>
                  Give your workflow an identity.
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
                setName(event.target.value)
              }
              placeholder="e.g. Payment Processing"
            />

            <label htmlFor="workflow-description">
              Description
            </label>

            <textarea
              id="workflow-description"
              className="form-input textarea"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what this workflow does..."
            />
          </div>

          <div className="form-panel">
            <div className="form-heading">
              <div className="step-number">
                02
              </div>

              <div>
                <h2>Workflow Steps</h2>

                <p>
                  Define the services involved in the
                  workflow.
                </p>
              </div>
            </div>

            {steps.map((step, index) => (
              <div
                className="workflow-step"
                key={step.id}
              >
                <div className="step-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="step-info">
                  <strong>{step.name}</strong>
                  <span>{step.service}</span>
                </div>

                {steps.length > 1 && (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeStep(step.id)
                    }
                    title="Remove step"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            <button
              className="add-step-btn"
              onClick={addStep}
            >
              <Plus size={15} />
              Add Workflow Step
            </button>
          </div>

          <button
            className="deploy-btn"
            onClick={handleDeploy}
          >
            <Rocket size={17} />
            Deploy Protected Workflow
          </button>
        </div>

        <div className="protection-preview">
          <div className="preview-icon">
            <ShieldCheck size={25} />
          </div>

          <h2>FlowGuard Protection</h2>

          <p>
            Once deployed, FlowGuard continuously analyzes
            workflow execution behavior.
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