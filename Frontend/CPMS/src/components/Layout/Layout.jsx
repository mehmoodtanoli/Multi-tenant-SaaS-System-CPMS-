import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ currentPage, onNavigate, children }) => {
  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="app-main">
        <Navbar currentPage={currentPage} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
