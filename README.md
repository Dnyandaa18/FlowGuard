# FlowGuard

> **An AI-powered workflow reliability guardian that learns normal behavior, detects anomalies, explains risk, and recommends recovery.**

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Data-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## The Problem

Modern applications rarely fail because of one isolated component.

A payment workflow, order pipeline, authentication flow, or notification chain can depend on multiple services. When one step becomes slower than normal or starts failing, traditional monitoring often answers only:

**"Something is wrong."**

FlowGuard is designed to answer the more useful questions:

- **What changed?**
- **How abnormal is it compared with normal behavior?**
- **Why was this execution flagged?**
- **What should we do next?**

---

## The Solution

**FlowGuard turns workflow execution history into operational intelligence.**

Instead of relying only on fixed thresholds, FlowGuard learns historical workflow behavior and builds statistical baselines.

```text
Workflow Execution
        ↓
Execution History
        ↓
Historical Baseline Learning
        ↓
Average • Std Dev • P95 • Range
        ↓
Anomaly Detection
        ↓
Explainable Risk Analysis
        ↓
Recovery Recommendation
        ↓
Incident History
```

The result is a reliability workflow that moves beyond detection:

**Observe → Learn → Detect → Explain → Recover**

---

## What Makes FlowGuard Different?

### 1. Historical Baseline Learning

FlowGuard learns from previous workflow executions instead of treating every execution in isolation.

It tracks:

- Average latency
- Standard deviation
- Minimum and maximum observed latency
- P95 latency
- Failure rate
- Service-level behavior
- Number of historical samples

A workflow progresses from **LEARNING** to **LEARNED** once enough historical data is available.

### 2. Explainable Anomaly Detection

When an execution becomes abnormal, FlowGuard does not simply display a red alert.

It provides context such as:

- Current execution latency
- Historical average
- Standard deviation
- Deviation ratio
- Statistical z-score
- Failure rate
- Risk level
- Detection method

This makes the alert understandable to a developer, operator, or judge.

### 3. Recovery Recommendations

Detection is only the beginning.

FlowGuard generates a recovery recommendation based on the execution context so that the system can move from:

**"A problem happened."**

to:

**"Here is why it happened and what should happen next."**

### 4. Incident History

Every execution can become part of the workflow's operational history.

This creates a traceable record of:

- Normal executions
- Failed executions
- Anomalous executions
- Risk scores
- Detection methods
- Recovery recommendations

### 5. Workflow Health Visibility

The dashboard and health views provide a high-level view of the system so users can move from an overall signal into detailed execution intelligence.

---

## Core Demo

The fastest way to understand FlowGuard is to watch this sequence:

1. Open **Dashboard**
2. Select **Workflows**
3. Open **Execution Lab**
4. Review the **Historical Baseline**
5. Run the workflow normally
6. Repeat normal executions to build the baseline
7. Trigger an intentional failure
8. Inspect **Anomaly Intelligence**
9. Review the **Recovery Recommendation**
10. Open **Execution History / Incidents**

The key moment is the transition from historical normal behavior to an abnormal execution.

---

## Architecture

```text
                 ┌─────────────────────┐
                 │     React + Vite    │
                 │      Dashboard      │
                 └──────────┬──────────┘
                            │
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │   Node + Express    │
                 │    FlowGuard API    │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        Workflows       Executions    Baselines
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                    ┌───────────────┐
                    │    MongoDB    │
                    │ History + Data│
                    └───────────────┘
```

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| UI Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB |
| API Style | REST |
| Intelligence | Statistical historical baselines + explainable anomaly analysis |
| Deployment | Vercel + Render + MongoDB Atlas |

---

## Project Structure

```text
FlowGuard/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── AlertItem.jsx
│   │   ├── AnomalyPanel.jsx
│   │   ├── BaselinePanel.jsx
│   │   ├── ExecutionTimeline.jsx
│   │   ├── RecoveryPanel.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── Topbar.jsx
│   │   └── WorkflowCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── CreateWorkflow.jsx
│   │   ├── ExecutionHistory.jsx
│   │   ├── ExecutionLab.jsx
│   │   ├── Incidents.jsx
│   │   ├── SystemHealth.jsx
│   │   └── Workflows.jsx
│   └── services/
│       └── api.js
└── server/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── database.js
    ├── controllers/
    ├── data/
    ├── routes/
    └── services/
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB / MongoDB Atlas
- npm

### 1. Clone

```bash
git clone https://github.com/Dnyandaa18/FlowGuard.git
cd FlowGuard
```

### 2. Install

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=flowguard
FRONTEND_URL=http://localhost:5173
```

### 4. Start the backend

```bash
npm run server
```

API:

```text
http://localhost:5000/api
```

Health check:

```text
http://localhost:5000/api/health
```

### 5. Start the frontend

In another terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Production Deployment

FlowGuard is designed to be deployed as three simple pieces:

```text
Vercel
  │
  │ VITE_API_URL
  ▼
Render API
  │
  │ MONGODB_URI
  ▼
MongoDB Atlas
```

### Frontend — Vercel

Deploy the repository to Vercel with:

- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

Set:

```env
VITE_API_URL=https://YOUR-RENDER-API.onrender.com/api
```

### Backend — Render

Create a Web Service using the same repository.

- **Build command:** `npm install`
- **Start command:** `npm run server`

Set:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=flowguard
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
```

Render automatically provides the `PORT` environment variable, which FlowGuard uses.

### Database — MongoDB Atlas

Create a MongoDB Atlas database and provide its connection string as:

```env
MONGODB_URI=...
```

Do not commit database credentials or `.env` files.

---

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API + database health |
| GET | `/api/workflows` | List workflows |
| GET | `/api/workflows/:id` | Get workflow |
| POST | `/api/workflows` | Create workflow |
| GET | `/api/executions` | Execution history |
| GET | `/api/executions/:id` | Execution details |
| POST | `/api/executions/:workflowId/run` | Run workflow |
| GET | `/api/baselines/:workflowId` | Get learned baseline |

---

## Why This Matters

FlowGuard is built around a simple reliability principle:

> **A workflow should not be judged only by whether it failed. It should be judged by how far its current behavior has moved from what the system has learned to be normal.**

This makes the project applicable to:

- Payment pipelines
- Order processing
- Notification systems
- Data pipelines
- Authentication workflows
- Microservice orchestration
- Background jobs
- Business automation

---

## Hackathon Focus

FlowGuard demonstrates an end-to-end reliability loop:

**Historical Data → Statistical Learning → Anomaly Detection → Explainability → Recovery**

The project is intentionally designed to make the intelligence visible rather than hiding it behind a black-box score.

---

## Team / Project

**FlowGuard — Workflow Reliability Guardian**

Built for **Algothon'26**.

Repository: https://github.com/Dnyandaa18/FlowGuard

---

## License

This project is currently intended as a hackathon project.
