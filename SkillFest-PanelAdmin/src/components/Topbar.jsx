import { useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();

  const titleMap = {
    "/dashboard": "Dashboard",
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
    "/resultados": "Resultados",
  };

  const title = titleMap[location.pathname] || "SkillFest Panel";

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>Panel administrativo web</p>
      </div>
    </header>
  );
}

export default Topbar;