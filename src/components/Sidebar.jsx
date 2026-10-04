
import {
  LayoutDashboard,
  GitBranch,
  ShieldAlert,
  Activity,
  Settings,
  Plus,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h2>FlowGuard</h2>
          <span>AI Workflow Guardian</span>
        </div>
      </div>

      <button
        className="create-btn"
        onClick={() => onNavigate("create")}
      >
        <Plus size={18} />
        Create Workflow
      </button>

      <nav className="nav">
        <p className="nav-label">MONITOR</p>

        <button
          className={`nav-item ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => onNavigate("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activePage === "workflows" ? "active" : ""
          }`}
          onClick={() => onNavigate("workflows")}
        >
          <GitBranch size={18} />
          Workflows
          <span className="nav-count">8</span>
        </button>

        <button
          className={`nav-item ${
            activePage === "lab" ? "active" : ""
          }`}
          onClick={() => onNavigate("lab")}
        >
          <BrainCircuit size={18} />
          Execution Lab
          <span className="nav-new">NEW</span>
        </button>

        <button className="nav-item">
          <ShieldAlert size={18} />
          Incidents
          <span className="nav-count danger">3</span>
        </button>

        <button className="nav-item">
          <Activity size={18} />
          System Health
        </button>

        <p className="nav-label settings-label">SYSTEM</p>

        <button className="nav-item">
          <Settings size={18} />
          Settings
        </button>
      </nav>

      <div className="sidebar-status">
        <div className="status-dot"></div>

        <div>
          <strong>All systems operational</strong>
          <span>Last checked 12 sec ago</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;