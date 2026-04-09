import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import ResultadoCalculoModal from "../../components/resultados/ResultadoCalculoModal";
import {
  calcularResultado,
  getResultados,
  publicarResultados,
} from "../../api/resultados";

function ResultadosPage() {
  const [resultados, setResultados] = useState([]);
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
  const [eventoPublicarId, setEventoPublicarId] = useState("1");

  const cargarResultados = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getResultados({ page, size: 10 });
      setResultados(response.data || []);
      setMeta({
        paginaActual: response.paginaActual ?? 0,
        totalPaginas: response.totalPaginas ?? 0,
        totalElementos: response.totalElementos ?? 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar resultados"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResultados();
  }, [page]);

  const handleCalcular = async (payload) => {
    try {
      setSaving(true);
      await calcularResultado(payload);
      setModalOpen(false);
      await cargarResultados();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo calcular el resultado"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublicar = async () => {
    try {
      await publicarResultados(Number(eventoPublicarId));
      alert("Resultados publicados correctamente.");
      await cargarResultados();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo publicar resultados"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Resultados"
        description="Resultados, comparativas y publicación."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-actions">
            <button className="btn-primary" onClick={() => setModalOpen(true)}>
              Calcular resultado
            </button>
          </div>

          <div className="toolbar-group">
            <label>ID Evento para publicar</label>
            <input
              type="number"
              min="1"
              value={eventoPublicarId}
              onChange={(e) => setEventoPublicarId(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button className="btn-secondary" onClick={handlePublicar}>
              Publicar resultados
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando resultados...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Evento</th>
                    <th>Proyecto</th>
                    <th>Jurados</th>
                    <th>Popular</th>
                    <th>Total</th>
                    <th>Posición</th>
                    <th>Premio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.length > 0 ? (
                    resultados.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.eventoNombre || item.eventoId}</td>
                        <td>{item.proyectoTitulo || item.proyectoId}</td>
                        <td>{item.puntajeJurados ?? "-"}</td>
                        <td>{item.puntajePopular ?? "-"}</td>
                        <td>{item.puntajeTotal ?? "-"}</td>
                        <td>{item.posicion ?? "-"}</td>
                        <td>{item.categoriaPremio || "-"}</td>
                        <td>{item.estado || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No hay resultados disponibles.</td>
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

      <ResultadoCalculoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCalcular}
        loading={saving}
      />
    </div>
  );
}

export default ResultadosPage;