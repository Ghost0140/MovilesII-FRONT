import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;