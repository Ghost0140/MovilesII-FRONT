import { NavLink } from "react-router-dom";
import UiIcon from "./UiIcon";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },

  { to: "/app-dashboard", label: "Dashboard App", icon: "dashboard", roles: ["ESTUDIANTE"] },
  { to: "/mi-radar", label: "Mi Talent Radar", icon: "radar", roles: ["ESTUDIANTE"] },
  { to: "/inscribir", label: "Inscripcion", icon: "plus", roles: ["ESTUDIANTE"] },

  { to: "/usuarios", label: "Usuarios", icon: "users", roles: ["ADMIN"] },
  { to: "/eventos", label: "Eventos", icon: "calendar", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/equipos", label: "Equipos", icon: "team", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/proyectos", label: "Proyectos", icon: "folder", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/contribuciones", label: "Contribuciones", icon: "activity", roles: ["ADMIN", "ORGANIZADOR"] },
  { to: "/repositorios", label: "Repositorios", icon: "repo", roles: ["ADMIN", "ORGANIZADOR"] },

  { to: "/ranking-area", label: "Ranking Area", icon: "trophy", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },
  { to: "/ranking-sede", label: "Ranking Sede", icon: "map", roles: ["ADMIN", "ORGANIZADOR", "JURADO"] },
  { to: "/app-rankings", label: "Rankings App", icon: "radar", roles: ["ADMIN", "ORGANIZADOR", "RECLUTADOR"] },

  { to: "/reclutador", label: "Reclutador", icon: "briefcase", roles: ["ADMIN", "ORGANIZADOR", "RECLUTADOR"] },

];

function SkillFestMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M24 4 42 14v20L24 44 6 34V14L24 4Z" fill="url(#sfGradient)" />
        <path d="M16 30c2.5 2 5.6 3 9.2 3 5.4 0 8.8-2.6 8.8-6.5 0-4.4-3.8-5.4-8.1-6.2-3.8-.7-5.6-1.1-5.6-2.7 0-1.3 1.4-2.3 4-2.3 2.4 0 4.6.7 6.8 2.2l2.4-4.2c-2.4-1.8-5.4-2.8-9-2.8-5.2 0-8.6 2.8-8.6 6.8 0 4.6 4 5.5 8.3 6.3 3.6.6 5.3 1.1 5.3 2.6 0 1.4-1.5 2.2-4.3 2.2-2.8 0-5.4-.9-7.3-2.7L16 30Z" fill="white" />
        <defs>
          <linearGradient id="sfGradient" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#be123c" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function Sidebar() {
  const userRol = localStorage.getItem("userRol") || "";

  const puedeVer = (item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((rol) => userRol.includes(rol));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-row">
          <SkillFestMark />
          <div>
            <h2>SkillFest</h2>
            <span>Panel Admin</span>
          </div>
        </div>
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
            <span className="sidebar-icon" aria-hidden="true">
              <UiIcon name={item.icon} className="sidebar-svg" />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
