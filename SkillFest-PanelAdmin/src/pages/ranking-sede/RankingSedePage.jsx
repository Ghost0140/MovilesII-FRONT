import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getRankingSede } from "../../api/rankingSede";

function RankingSedePage() {
  const [eventoId, setEventoId] = useState("1");
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRankingSede(eventoId);
      setRanking(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar ranking de sedes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRanking();
  }, []);

  return (
    <div>
      <PageHeader
        title="Ranking por Sede"
        description="Vista analítica por sedes."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>ID Evento</label>
            <input
              type="number"
              min="1"
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary" onClick={cargarRanking}>
              Consultar
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando ranking...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Sede</th>
                  <th>Puntos</th>
                  <th>Proyectos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length > 0 ? (
                  ranking.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.posicion ?? index + 1}</td>
                      <td>{item.sedeNombre || "-"}</td>
                      <td>{item.puntosTotales ?? "-"}</td>
                      <td>{item.proyectosPresentados ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay datos de ranking.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RankingSedePage;