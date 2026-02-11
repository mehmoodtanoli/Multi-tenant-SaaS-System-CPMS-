import { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Members from "./pages/Members.jsx";
import Login from "./pages/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import api from "./services/api.js";

const App = () => {
  const { session } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  const pageView = useMemo(() => {
    if (currentPage === "projects") return <Projects />;
    if (currentPage === "tasks") return <Tasks />;
    if (currentPage === "members") return <Members />;
    return <Dashboard />;
  }, [currentPage]);

  useEffect(() => {
    api.setToken(session?.access_token || null);
  }, [session]);

  if (!session) {
    return <Login />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {pageView}
    </Layout>
  );
};

export default App;
