import { NavLink } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Dashboard", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },
  
  { to: "/app-dashboard", label: "Dashboard App", roles: ["ESTUDIANTE"] },
  { to: "/mi-radar", label: "Mi Talent Radar", roles: ["ESTUDIANTE"] },
  { to: "/inscribir", label: "Inscripción", roles: ["ESTUDIANTE"] },
  
  { to: "/portafolio", label: "Portafolio", roles: ["ESTUDIANTE", "RECLUTADOR", "ADMIN", "ORGANIZADOR"] },

  { to: "/usuarios", label: "Usuarios", roles: ["ADMIN"] },
  { to: "/eventos", label: "Eventos", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/equipos", label: "Equipos", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/proyectos", label: "Proyectos", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/contribuciones", label: "Contribuciones", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/repositorios", label: "Repositorios", roles: ["ADMIN", "ORGANIZADOR"] },

  { to: "/ranking-area", label: "Ranking Área", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },
  { to: "/ranking-sede", label: "Ranking Sede", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },
  { to: "/app-rankings", label: "Rankings App", roles: ["ADMIN", "ORGANIZADOR", "RECLUTADOR"] },
  
  { to: "/reclutador", label: "Reclutador", roles: ["ADMIN", "ORGANIZADOR", "RECLUTADOR"] },

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