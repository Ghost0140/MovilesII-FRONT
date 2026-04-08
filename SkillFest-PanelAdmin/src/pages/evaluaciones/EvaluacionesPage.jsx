import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import EvaluacionFormModal from "../../components/evaluaciones/EvaluacionFormModal";
import {
  createEvaluacion,
  deleteEvaluacion,
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

  const cargarEvaluaciones = async () => {
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
  };

  useEffect(() => {
    cargarEvaluaciones();
  }, [page]);

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
          "No se pudo crear la evaluación"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvaluacion(id);
      await cargarEvaluaciones();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo eliminar la evaluación"
      );
    }
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
            <button className="btn-primary" onClick={() => setModalOpen(true)}>
              Nueva evaluación
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
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluaciones.length > 0 ? (
                    evaluaciones.map((evaluacion) => (
                      <tr key={evaluacion.id}>
                        <td>{evaluacion.id}</td>
                        <td>{evaluacion.proyectoTitulo || evaluacion.proyectoId}</td>
                        <td>{evaluacion.juradoNombre || evaluacion.juradoId}</td>
                        <td>{evaluacion.criterioNombre || evaluacion.criterioId}</td>
                        <td>{evaluacion.puntaje}</td>
                        <td>{evaluacion.comentario || "-"}</td>
                        <td>{evaluacion.evaluadoEn || "-"}</td>
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(evaluacion.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No hay evaluaciones disponibles.</td>
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

      <EvaluacionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        loading={saving}
      />
    </div>
  );
}

export default EvaluacionesPage;