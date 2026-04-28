import { Navigate } from "react-router-dom";

function RoleRedirect() {
  const userRol = localStorage.getItem("userRol") || "";

  if (userRol.includes("ESTUDIANTE")) {
    return <Navigate to="/app-dashboard" replace />;
  }

  if (userRol.includes("RECLUTADOR")) {
    return <Navigate to="/reclutador" replace />;
  }

  if (
    userRol.includes("ADMIN") ||
    userRol.includes("PROFESOR") ||
    userRol.includes("ORGANIZADOR")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  if (userRol.includes("JURADO")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export default RoleRedirect;
