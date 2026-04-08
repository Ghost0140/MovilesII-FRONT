import { NavLink } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/usuarios", label: "Usuarios" },
  { to: "/eventos", label: "Eventos" },
  { to: "/equipos", label: "Equipos" },
  { to: "/evaluaciones", label: "Evaluaciones" },
  { to: "/proyectos", label: "Proyectos" },
  { to: "/portafolio", label: "Portafolio" },
  { to: "/contribuciones", label: "Contribuciones" },
  { to: "/repositorios", label: "Repositorios" },
  { to: "/ranking-area", label: "Ranking Área" },
  { to: "/ranking-sede", label: "Ranking Sede" },
  { to: "/resultados", label: "Resultados" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>SkillFest</h2>
        <span>Panel Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
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