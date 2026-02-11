import Button from "../UI/Button.jsx";
import {
  IconDashboard,
  IconMembers,
  IconProjects,
  IconTasks,
} from "../Icons.jsx";

const navItems = [
  { key: "dashboard", label: "Dashboard", Icon: IconDashboard },
  { key: "projects", label: "Projects", Icon: IconProjects },
  { key: "tasks", label: "Tasks", Icon: IconTasks },
  { key: "members", label: "Members", Icon: IconMembers },
];

const Sidebar = ({ currentPage, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true">
          <svg className="brand-icon" viewBox="0 0 24 24" role="img">
            <path d="M5 16.5c0-4.7 3.8-8.5 8.5-8.5h5v4h-5a4.5 4.5 0 0 0 0 9h3.5v3H13.5C8.8 24 5 20.2 5 15.5v1z" />
            <path d="M19 8.5V5H8.5C4.9 5 2 7.9 2 11.5S4.9 18 8.5 18H12v-3H8.5a3.5 3.5 0 0 1 0-7H19z" />
          </svg>
        </div>
        <div>
          <div className="brand-title">CPMS</div>
          <div className="brand-subtitle">Client Project Hub</div>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        <div className="sidebar-workspace">Northstar Studio</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ key, label, Icon }) => (
          <Button
            key={key}
            variant={currentPage === key ? "primary" : "ghost"}
            className="sidebar-button"
            onClick={() => onNavigate(key)}
          >
            <Icon className="sidebar-icon" />
            <span>{label}</span>
          </Button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-card">
          <div className="sidebar-card-title">Weekly Focus</div>
          <p>Keep delivery crisp with high-impact milestones.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
