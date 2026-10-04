import {
  LayoutDashboard,
  GitBranch,
  ShieldAlert,
  Activity,
  Settings,
  Plus,
  ShieldCheck,
  BrainCircuit,
  History,
} from "lucide-react";

function Sidebar({ activePage, onNavigate, workflowCount = 0 }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "workflows", label: "Workflows", icon: GitBranch, count: workflowCount },
    { id: "lab", label: "Execution Lab", icon: BrainCircuit, badge: "NEW" },
    { id: "history", label: "Execution History", icon: History },
    { id: "incidents", label: "Incidents", icon: ShieldAlert, count: 3, danger: true },
    { id: "health", label: "System Health", icon: Activity },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><ShieldCheck size={22} /></div>
        <div><h2>FlowGuard</h2><span>AI Workflow Guardian</span></div>
      </div>

      <button className="create-btn" onClick={() => onNavigate("create")}>
        <Plus size={18} />
        Create Workflow
      </button>

      <nav className="nav">
        <p className="nav-label">MONITOR</p>

        {items.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={`nav-count ${item.danger ? "danger" : ""}`}>{item.count}</span>
              )}
              {item.badge && <span className="nav-new">{item.badge}</span>}
            </button>
          );
        })}

        <p className="nav-label settings-label">SYSTEM</p>

        <button
          type="button"
          className={`nav-item ${activePage === "settings" ? "active" : ""}`}
          onClick={() => onNavigate("settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-status">
        <div className="status-dot"></div>
        <div>
          <strong>All systems operational</strong>
          <span>FlowGuard monitoring active</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
