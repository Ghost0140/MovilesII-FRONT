import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  aprobarProyecto,
  analizarRadarProyecto,
  getProyectos,
  rechazarProyecto,
} from "../../api/proyectos";

function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
  });

  const estadosProyecto = [
    "BORRADOR",
    "ENVIADO",
    "APROBADO",
    "RECHAZADO",
    "OBSERVADO",
    "ELIMINADO",
  ];

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

  const isGithubRepoValido = (url) => {
    if (!url) return false;
    return /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\/)?(?:\.git)?$/i.test(
      url.trim()
    );
  };

  const ejecutarAccion = async (proyectoId, accion, successMessage) => {
    try {
      setActionLoadingId(proyectoId);
      setFeedback({ type: "", message: "" });

      await accion();
      await cargarProyectos();

      setFeedback({
        type: "success",
        message: successMessage,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo ejecutar la acción",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderAcciones = (proyecto) => {
    const repoValido = isGithubRepoValido(proyecto.repositorioUrl);
    const cargando = actionLoadingId === proyecto.id;

    if (proyecto.estado === "ENVIADO" || proyecto.estado === "OBSERVADO") {
      return (
        <div className="actions-inline">
          <button
            className="btn-primary"
            disabled={cargando}
            onClick={() =>
              ejecutarAccion(
                proyecto.id,
                () => aprobarProyecto(proyecto.id),
                "Proyecto aprobado correctamente. El radar se ejecutó automáticamente."
              )
            }
          >
            {cargando ? "Procesando..." : "Aprobar"}
          </button>

          <button
            className="btn-danger"
            disabled={cargando}
            onClick={() =>
              ejecutarAccion(
                proyecto.id,
                () => rechazarProyecto(proyecto.id),
                "Proyecto rechazado correctamente."
              )
            }
          >
            {cargando ? "Procesando..." : "Rechazar"}
          </button>
        </div>
      );
    }

    if (proyecto.estado === "APROBADO") {
      return (
        <div className="actions-inline">
          <button
            className="btn-secondary"
            disabled={cargando || !repoValido}
            onClick={() =>
              ejecutarAccion(
                proyecto.id,
                () => analizarRadarProyecto(proyecto.id),
                "Reanálisis ejecutado correctamente. Revisa Repositorios y Contribuciones."
              )
            }
            title={
              repoValido
                ? "Volver a ejecutar el análisis del repositorio"
                : "El proyecto no tiene un repositorio GitHub válido"
            }
          >
            {cargando ? "Procesando..." : "Reanalizar"}
          </button>
        </div>
      );
    }

    return <span className="muted-text">Sin acciones</span>;
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
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
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

      {feedback.message ? (
        <div
          className={`card mb-16 ${
            feedback.type === "success" ? "feedback-success" : "feedback-error"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosFiltrados.length > 0 ? (
                    proyectosFiltrados.map((proyecto) => (
                      <tr key={proyecto.id}>
                        <td>{proyecto.id}</td>
                        <td>{proyecto.titulo}</td>
                        <td>{proyecto.eventoNombre || "-"}</td>
                        <td>
                          {proyecto.equipoNombre ||
                            proyecto.usuarioNombre ||
                            "-"}
                        </td>
                        <td className="truncate-cell">
                          {proyecto.repositorioUrl || "-"}
                        </td>
                        <td>
                          <span className="badge neutral">
                            {proyecto.estado}
                          </span>
                        </td>
                        <td>{renderAcciones(proyecto)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No hay proyectos disponibles.</td>
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
                Página {meta.paginaActual + 1} de{" "}
                {Math.max(meta.totalPaginas, 1)}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={
                  meta.totalPaginas === 0 || page + 1 >= meta.totalPaginas
                }
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