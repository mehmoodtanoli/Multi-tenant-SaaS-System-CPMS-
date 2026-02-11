import Badge from "../UI/Badge.jsx";
import Button from "../UI/Button.jsx";
import { IconBell, IconSearch } from "../Icons.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";

const Navbar = ({ currentPage }) => {
  const { setSession } = useAuth();
  const pageLabel = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setSession(null);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">{pageLabel}</div>
        <div className="navbar-subtitle">
          Delivery intelligence for modern agencies
        </div>
      </div>
      <div className="navbar-actions">
        <div className="navbar-chip">Sprint 05</div>
        <div className="search-pill">
          <IconSearch className="icon" />
          <span>Search projects or tasks</span>
        </div>
        <Badge variant="info">Live</Badge>
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
        <Button variant="ghost" className="icon-button">
          <IconBell className="icon" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
