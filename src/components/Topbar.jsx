import { Bell, Search, CircleUserRound } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={18} />
        <input placeholder="Search workflows, incidents..." />
        <span>⌘ K</span>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn notification">
          <Bell size={19} />
          <i></i>
        </button>

        <div className="user">
          <div className="avatar">D</div>

          <div className="user-info">
            <strong>Developer</strong>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;