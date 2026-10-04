
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import CreateWorkflow from "./pages/CreateWorkflow";
import ExecutionLab from "./pages/ExecutionLab";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "workflows":
        return <Workflows onNavigate={setActivePage} />;

      case "create":
        return <CreateWorkflow onNavigate={setActivePage} />;

      case "lab":
        return <ExecutionLab />;

      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
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