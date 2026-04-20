import { NavLink } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Dashboard", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/app-dashboard", label: "Dashboard App", roles: ["ESTUDIANTE"] },
  { to: "/mi-radar", label: "Mi Talent Radar", roles: ["ESTUDIANTE"] },
  { to: "/inscribir", label: "Inscripción", roles: ["ESTUDIANTE"] },
  { to: "/portafolio", label: "Portafolio", roles: ["ESTUDIANTE", "RECLUTADOR", "ADMIN", "PROFESOR", "ORGANIZADOR"] },

  { to: "/usuarios", label: "Usuarios", roles: ["ADMIN", "PROFESOR"] },
  { to: "/eventos", label: "Eventos", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/equipos", label: "Equipos", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/proyectos", label: "Proyectos", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/contribuciones", label: "Contribuciones", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/repositorios", label: "Repositorios", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },

  { to: "/ranking-area", label: "Ranking Área", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },
  { to: "/ranking-sede", label: "Ranking Sede", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR"] },


  { to: "/app-rankings", label: "Rankings App", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR", "RECLUTADOR"] },
  { to: "/reclutador", label: "Reclutador", roles: ["ADMIN", "PROFESOR", "ORGANIZADOR", "RECLUTADOR"] },

  { to: "/evaluaciones", label: "Evaluaciones", roles: ["ADMIN", "JURADO"] },
  { to: "/resultados", label: "Resultados", roles: ["ADMIN", "JURADO"] },
];

function Sidebar() {
  const userRol = localStorage.getItem("userRol") || "";

  const puedeVer = (item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((rol) => userRol.includes(rol));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>SkillFest</h2>
        <span>Panel Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menu.filter(puedeVer).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;