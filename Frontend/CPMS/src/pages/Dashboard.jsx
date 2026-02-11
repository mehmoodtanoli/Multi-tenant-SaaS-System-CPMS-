import { useEffect, useState } from "react";
import Card from "../components/UI/Card.jsx";
import Badge from "../components/UI/Badge.jsx";
import api from "../services/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    activeProjects: 0,
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        if (!isMounted) return;
        setStats({
          totalProjects: data?.totalProjects ?? 0,
          totalTasks: data?.totalTasks ?? 0,
          activeProjects: data?.activeProjects ?? 0,
        });
        setStatus("ready");
        setError("");
        setLastUpdated(new Date());
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setError(err?.message || "Failed to load stats");
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const badgeLabel =
    status === "ready" ? "Live" : status === "error" ? "Issue" : "Syncing";
  const badgeVariant = status === "ready" ? "info" : "neutral";

  return (
    <div className="page-grid">
      <Card className="stat-card">
        <div className="stat-head">
          <p className="stat-label">Total Projects</p>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <div className="stat-value">{stats.totalProjects}</div>
        <div className="stat-meta">Portfolio size across all clients</div>
      </Card>
      <Card className="stat-card">
        <div className="stat-head">
          <p className="stat-label">Total Tasks</p>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <div className="stat-value">{stats.totalTasks}</div>
        <div className="stat-meta">Work items in active circulation</div>
      </Card>
      <Card className="stat-card">
        <div className="stat-head">
          <p className="stat-label">Active Projects</p>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <div className="stat-value">{stats.activeProjects}</div>
        <div className="stat-meta">Momentum tracking this week</div>
      </Card>
      <Card className="wide-card insight-card">
        <div>
          <h3>Delivery snapshot</h3>
          <p>
            {status === "error"
              ? error
              : "Auto-refreshing every 10 seconds to keep KPIs current."}
          </p>
        </div>
        <div className="insight-meta">
          <div className="insight-pill">Capacity: Balanced</div>
          <div className="insight-pill">Risk: Low</div>
        </div>
        {lastUpdated ? (
          <p className="insight-time">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        ) : null}
      </Card>
    </div>
  );
};

export default Dashboard;
