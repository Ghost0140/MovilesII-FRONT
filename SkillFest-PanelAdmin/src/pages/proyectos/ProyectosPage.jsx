import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  aprobarProyecto,
  analizarRadarProyecto,
  cambiarEstadoProyecto,
  getProyectos,
  rechazarProyecto,
} from "../../api/proyectos";

const estadosProyecto = [
  "BORRADOR",
  "ENVIADO",
  "APROBADO",
  "RECHAZADO",
  "OBSERVADO",
  "ELIMINADO",
];

function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
  });

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProyectos({ page, size: 10 });
      setProyectos(response.data || []);
      setMeta({
        paginaActual: response.paginaActual ?? 0,
        totalPaginas: response.totalPaginas ?? 0,
        totalElementos: response.totalElementos ?? 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar proyectos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, [page]);

  const proyectosFiltrados = useMemo(() => {
    if (!estadoFiltro) return proyectos;
    return proyectos.filter((p) => p.estado === estadoFiltro);
  }, [proyectos, estadoFiltro]);

  const ejecutarAccion = async (accion) => {
    try {
      await accion();
      await cargarProyectos();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo ejecutar la acción"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Revisión de proyectos y control de estados."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Filtrar por estado</label>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">Todos</option>
              {estadosProyecto.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando proyectos...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Evento</th>
                    <th>Equipo/Usuario</th>
                    <th>Repositorio</th>
                    <th>Estado</th>
                    <th>Aprobar</th>
                    <th>Rechazar</th>
                    <th>Radar</th>
                    <th>Nuevo estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosFiltrados.length > 0 ? (
                    proyectosFiltrados.map((proyecto) => (
                      <tr key={proyecto.id}>
                        <td>{proyecto.id}</td>
                        <td>{proyecto.titulo}</td>
                        <td>{proyecto.eventoNombre || "-"}</td>
                        <td>{proyecto.equipoNombre || proyecto.usuarioNombre || "-"}</td>
                        <td className="truncate-cell">{proyecto.repositorioUrl || "-"}</td>
                        <td>
                          <span className="badge neutral">{proyecto.estado}</span>
                        </td>
                        <td>
                          <button
                            className="btn-primary"
                            onClick={() =>
                              ejecutarAccion(() => aprobarProyecto(proyecto.id))
                            }
                          >
                            Aprobar
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() =>
                              ejecutarAccion(() => rechazarProyecto(proyecto.id))
                            }
                          >
                            Rechazar
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            onClick={() =>
                              ejecutarAccion(() => analizarRadarProyecto(proyecto.id))
                            }
                          >
                            Analizar
                          </button>
                        </td>
                        <td>
                          <select
                            className="inline-select"
                            value={proyecto.estado}
                            onChange={(e) =>
                              ejecutarAccion(() =>
                                cambiarEstadoProyecto(proyecto.id, e.target.value)
                              )
                            }
                          >
                            {estadosProyecto.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">No hay proyectos disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Anterior
              </button>

              <span>
                Página {meta.paginaActual + 1} de {Math.max(meta.totalPaginas, 1)}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={meta.totalPaginas === 0 || page + 1 >= meta.totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProyectosPage;