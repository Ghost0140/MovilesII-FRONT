import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  getMejoresContribuidores,
  getProyectosDestacados,
} from "../../api/appReclutador";

function ReclutadorPage() {
  const [area, setArea] = useState("");
  const [limit, setLimit] = useState(10);
  const [contribuidores, setContribuidores] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const areas = ["", "FRONTEND", "BACKEND", "BD", "MOBILE", "TESTING"];

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [contribuidoresData, proyectosData] = await Promise.all([
        getMejoresContribuidores({ area, limit }),
        getProyectosDestacados({ limit }),
      ]);

      setContribuidores(contribuidoresData || []);
      setProyectos(proyectosData || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          "No se pudo cargar la información de reclutador"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [area, limit]);

  return (
    <div>
      <PageHeader
        title="Reclutador"
        description="Historial de mejores contribuidores y proyectos destacados."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Área</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              {areas.map((item) => (
                <option key={item || "TODAS"} value={item}>
                  {item || "TODAS"}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label>Límite</label>
            <input
              type="number"
              min="1"
              max="50"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={cargarDatos}>
            Actualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p>Cargando información...</p>
        </div>
      ) : error ? (
        <div className="card feedback-error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="card mb-16">
            <h3>Mejores contribuidores</h3>

            <div className="table-wrapper mt-12">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>GitHub</th>
                    <th>Sede</th>
                    <th>Proyecto</th>
                    <th>Commits</th>
                    <th>Promedio</th>
                    <th>Frontend</th>
                    <th>Backend</th>
                    <th>BD</th>
                    <th>Mobile</th>
                    <th>Testing</th>
                  </tr>
                </thead>
                <tbody>
                  {contribuidores.length > 0 ? (
                    contribuidores.map((item) => (
                      <tr key={item.contribucionId}>
                        <td>
                          {item.nombres} {item.apellidos}
                        </td>
                        <td>{item.githubUsername || "-"}</td>
                        <td>{item.sede || "-"}</td>
                        <td>{item.proyectoTitulo || "-"}</td>
                        <td>{item.totalCommits ?? 0}</td>
                        <td>
                          <span className="badge success">
                            {item.scorePromedio}
                          </span>
                        </td>
                        <td>{item.scoreFrontend}</td>
                        <td>{item.scoreBackend}</td>
                        <td>{item.scoreBd}</td>
                        <td>{item.scoreMobile}</td>
                        <td>{item.scoreTesting}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">No hay contribuidores disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Proyectos destacados</h3>

            <div className="table-wrapper mt-12">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Evento</th>
                    <th>Tipo</th>
                    <th>Repo</th>
                    <th>Estado Radar</th>
                    <th>Commits</th>
                    <th>Contributors</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.length > 0 ? (
                    proyectos.map((item) => (
                      <tr key={item.proyectoId}>
                        <td>{item.titulo}</td>
                        <td>{item.eventoNombre || "-"}</td>
                        <td>
                          <span className="badge neutral">
                            {item.tipoParticipacion}
                          </span>
                        </td>
                        <td className="truncate-cell">
                          {item.repositorioUrl || "-"}
                        </td>
                        <td>
                          <span className="badge neutral">
                            {item.estadoRadar}
                          </span>
                        </td>
                        <td>{item.totalCommits ?? 0}</td>
                        <td>{item.contributorsGithub ?? 0}</td>
                        <td>
                          <span className="badge success">
                            {item.scorePromedioProyecto}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No hay proyectos destacados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReclutadorPage;