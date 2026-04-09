import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getRankingArea } from "../../api/rankingArea";

const areas = ["FRONTEND", "BACKEND", "BD", "MOBILE", "TESTING"];

function RankingAreaPage() {
  const [eventoId, setEventoId] = useState("1");
  const [area, setArea] = useState("BACKEND");
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRankingArea(eventoId, area);
      setRanking(response.data || response || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar ranking por área"
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
        title="Ranking por Área"
        description="Vista analítica con tabla del ranking."
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

          <div className="toolbar-group">
            <label>Área</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              {areas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
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
                  <th>Usuario</th>
                  <th>Área</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length > 0 ? (
                  ranking.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.posicion ?? index + 1}</td>
                      <td>{item.usuarioNombre || "-"}</td>
                      <td>{item.area || area}</td>
                      <td>{item.score ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay datos para esta área.</td>
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

export default RankingAreaPage;