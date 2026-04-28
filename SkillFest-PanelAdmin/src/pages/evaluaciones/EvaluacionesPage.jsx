import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import UiIcon from "../../components/UiIcon";
import { getProyectos } from "../../api/proyectos";
import EvaluacionFormModal from "../../components/evaluaciones/EvaluacionFormModal";
import {
  createEvaluacion,
  getEvaluaciones,
} from "../../api/evaluaciones";

function EvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [ocultas, setOcultas] = useState(() => new Set());

  const [proyectosList, setProyectosList] = useState([]);

  const cargarEvaluaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvaluaciones({ page, size: 10 });
      setEvaluaciones(response.data || []);
      setMeta({
        paginaActual: response.paginaActual ?? 0,
        totalPaginas: response.totalPaginas ?? 0,
        totalElementos: response.totalElementos ?? 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar evaluaciones"
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    cargarEvaluaciones();

    const cargarDatosFormulario = async () => {
      try {
        const resProyectos = await getProyectos({ page: 0, size: 100 });
        setProyectosList(resProyectos.data || []);
      } catch (err) {
        console.error("Error al cargar proyectos para el modal", err);
      }
    };

    cargarDatosFormulario();
  }, [cargarEvaluaciones]);

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await createEvaluacion(payload);
      setModalOpen(false);
      await cargarEvaluaciones();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo crear la evaluacion"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleOculta = (id) => {
    setOcultas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Evaluaciones"
        description="Registro y consulta de evaluaciones."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-actions">
            <button className="btn-primary action-btn" onClick={() => setModalOpen(true)}>
              <UiIcon name="plus" className="button-svg" />
              Nueva evaluacion
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando evaluaciones...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Proyecto</th>
                    <th>Jurado</th>
                    <th>Criterio</th>
                    <th>Puntaje</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluaciones.length > 0 ? (
                    evaluaciones.map((evaluacion) => {
                      const estaOculta = ocultas.has(evaluacion.id);

                      return (
                        <tr key={evaluacion.id} className={estaOculta ? "row-muted" : ""}>
                          <td>{evaluacion.id}</td>
                          <td>{evaluacion.proyectoTitulo || evaluacion.proyectoId}</td>
                          <td>{evaluacion.juradoNombre || evaluacion.juradoId}</td>
                          <td>{evaluacion.criterioNombre || evaluacion.criterioId}</td>
                          <td>{evaluacion.puntaje}</td>
                          <td>{evaluacion.comentario || "-"}</td>
                          <td>{evaluacion.evaluadoEn || "-"}</td>
                          <td>
                            <span className={`badge ${estaOculta ? "warning" : "success"}`}>
                              {estaOculta ? "Oculto" : "Activo"}
                            </span>
                          </td>
                          <td>
                            <button
                              className={estaOculta ? "btn-secondary action-btn" : "btn-ghost action-btn"}
                              onClick={() => toggleOculta(evaluacion.id)}
                            >
                              <UiIcon name={estaOculta ? "show" : "hide"} className="button-svg" />
                              {estaOculta ? "Activar" : "Ocultar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9">No hay evaluaciones disponibles.</td>
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
                Pagina {meta.paginaActual + 1} de {Math.max(meta.totalPaginas, 1)}
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

      <EvaluacionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        loading={saving}
        proyectos={proyectosList}
      />
    </div>
  );
}

export default EvaluacionesPage;
