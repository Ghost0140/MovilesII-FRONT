import { useLocation, useNavigate } from "react-router-dom";

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const correo = localStorage.getItem("userEmail") || "Usuario";
  const rol = localStorage.getItem("userRol") || "Invitado";

  const titleMap = {
    "/dashboard": "Dashboard",
    "/app-dashboard": "Dashboard App",
    "/mi-radar": "Mi Talent Radar",
    "/usuarios": "Usuarios",
    "/eventos": "Eventos",
    "/equipos": "Equipos",
    "/evaluaciones": "Evaluaciones",
    "/proyectos": "Proyectos",
    "/portafolio": "Portafolio Público",
    "/contribuciones": "Contribuciones",
    "/repositorios": "Repositorios",
    "/ranking-area": "Ranking por Área",
    "/ranking-sede": "Ranking por Sede",
    "/app-rankings": "Rankings App",
    "/reclutador": "Reclutador",
    "/resultados": "Resultados",
  };

  const getDescripcionPorRol = (rolUsuario) => {
    if (rolUsuario.includes("ESTUDIANTE")) {
      return "Panel del alumno";
    }

    if (rolUsuario.includes("RECLUTADOR")) {
      return "Panel de reclutamiento";
    }

    if (rolUsuario.includes("JURADO")) {
      return "Panel de evaluación";
    }

    if (
      rolUsuario.includes("ADMIN") ||
      rolUsuario.includes("PROFESOR") ||
      rolUsuario.includes("ORGANIZADOR")
    ) {
      return "Panel administrativo web";
    }

    return "Panel SkillFest";
  };

  const title = titleMap[location.pathname] || "SkillFest Panel";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRol");
    navigate("/login");
  };

  return (
    <header
      className="topbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1>{title}</h1>
        <p>{getDescripcionPorRol(rol)}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>{correo}</div>

          <div
            style={{
              fontSize: "12px",
              color: "#666",
              textTransform: "capitalize",
            }}
          >
            Rol: {rol}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#c82333";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#dc3545";
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

export default Topbar;