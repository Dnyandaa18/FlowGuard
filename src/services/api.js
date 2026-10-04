const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request(
  endpoint,
  options = {}
) {
  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
        ...options,
      }
    );

  let data;

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong with the API request."
    );
  }

  return data;
}

export async function checkApiHealth() {
  return request(
    "/health"
  );
}

export async function getWorkflows() {
  return request(
    "/workflows"
  );
}

export async function getWorkflowById(
  id
) {
  return request(
    `/workflows/${id}`
  );
}

export async function createWorkflow(
  workflow
) {
  return request(
    "/workflows",
    {
      method: "POST",
      body: JSON.stringify(
        workflow
      ),
    }
  );
}

export async function runWorkflow(
  workflowId,
  scenario = "normal"
) {
  return request(
    `/executions/${workflowId}/run`,
    {
      method: "POST",
      body: JSON.stringify({
        scenario,
      }),
    }
  );
}

export async function getExecutions(
  workflowId = ""
) {
  const query =
    workflowId
      ? `?workflowId=${encodeURIComponent(
          workflowId
        )}`
      : "";

  return request(
    `/executions${query}`
  );
}

export async function getExecutionById(
  executionId
) {
  return request(
    `/executions/${executionId}`
  );
}

export default {
  checkApiHealth,
  getWorkflows,
  getWorkflowById,
  createWorkflow,
  runWorkflow,
  getExecutions,
  getExecutionById,
};