import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import CreateWorkflow from "./pages/CreateWorkflow";
import ExecutionLab from "./pages/ExecutionLab";
import ExecutionHistory from "./pages/ExecutionHistory";
import Incidents from "./pages/Incidents";
import SystemHealth from "./pages/SystemHealth";

import {
  getWorkflows,
} from "./services/api";

function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [workflowCount, setWorkflowCount] =
    useState(0);

  const loadWorkflowCount =
    async () => {
      try {
        const response =
          await getWorkflows();

        if (response.success) {
          setWorkflowCount(
            response.count ??
              response.workflows
                ?.length ??
              0
          );
        }
      } catch (error) {
        console.error(
          "Unable to load workflow count:",
          error
        );
      }
    };

  useEffect(() => {
    loadWorkflowCount();
  }, [activePage]);

  const handleNavigate =
    (page) => {
      setActivePage(page);
    };

  const renderPage = () => {
    switch (activePage) {
      case "workflows":
        return (
          <Workflows
            onNavigate={
              handleNavigate
            }
          />
        );

      case "create":
        return (
          <CreateWorkflow
            onNavigate={
              handleNavigate
            }
          />
        );

      case "lab":
        return (
          <ExecutionLab />
        );

      case "history":
        return (
          <ExecutionHistory />
        );

      case "incidents":
        return (
          <Incidents />
        );

      case "health":
        return (
          <SystemHealth />
        );

      default:
        return (
          <Dashboard
            onNavigate={
              handleNavigate
            }
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={
          activePage
        }
        onNavigate={
          handleNavigate
        }
        workflowCount={
          workflowCount
        }
      />

      <div className="main">
        <Topbar />

        <main className="content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;