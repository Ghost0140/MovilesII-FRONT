import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  generarRankingsEvento,
  getAreasRanking,
  getRankingPorEventoYArea,
  getStatusRankingsEvento,
} from "../../api/appRankings";

function AppRankingsPage() {
  const [areas, setAreas] = useState([]);
  const [eventoId, setEventoId] = useState(1);
  const [area, setArea] = useState("FRONTEND");
  const [rankings, setRankings] = useState([]);
  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const userRol = localStorage.getItem("userRol") || "";
  const puedeGenerar =
    userRol.includes("ADMIN") ||
    userRol.includes("ORGANIZADOR") ||
    userRol.includes("PROFESOR");

  const cargarAreas = async () => {
    try {
      const data = await getAreasRanking();
      setAreas(data.areas || []);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarRanking = async () => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const data = await getRankingPorEventoYArea(eventoId, area);
      setRankings(data || []);

      if (puedeGenerar) {
        const statusData = await getStatusRankingsEvento(eventoId);
        setStatus(statusData);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          "No se pudo cargar el ranking",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarRankings = async () => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      await generarRankingsEvento(eventoId);
      await cargarRanking();

      setFeedback({
        type: "success",
        message: "Rankings generados correctamente.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          "No se pudieron generar los rankings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAreas();
  }, []);

  useEffect(() => {
    cargarRanking();
  }, [eventoId, area]);

  return (
    <div>
      <PageHeader
        title="Rankings por Área"
        description="Consulta el ranking de estudiantes según el área de desarrollo."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Evento ID</label>
            <input
              type="number"
              value={eventoId}
              min="1"
              onChange={(e) => setEventoId(e.target.value)}
            />
          </div>

          <div className="toolbar-group">
            <label>Área</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              {areas.length > 0 ? (
                areas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                <>
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                  <option value="BD">BD</option>
                  <option value="MOBILE">MOBILE</option>
                  <option value="TESTING">TESTING</option>
                </>
              )}
            </select>
          </div>

          {puedeGenerar && (
            <button
              className="btn-primary"
              disabled={loading}
              onClick={handleGenerarRankings}
            >
              {loading ? "Procesando..." : "Generar rankings"}
            </button>
          )}
        </div>
      </div>

      {status && (
        <div className="card mb-16">
          <h3>Estado del ranking</h3>
          <p className="muted-text">{status.mensaje}</p>
          <div className="stats-grid mt-12">
            <InfoCard titulo="Total" valor={status.totalRankings} />
            <InfoCard titulo="Frontend" valor={status.rankingsFrontend} />
            <InfoCard titulo="Backend" valor={status.rankingsBackend} />
            <InfoCard titulo="BD" valor={status.rankingsBd} />
            <InfoCard titulo="Testing" valor={status.rankingsTesting} />
          </div>
        </div>
      )}

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
          <p>Cargando rankings...</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Alumno</th>
                  <th>GitHub</th>
                  <th>Sede</th>
                  <th>Área</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {rankings.length > 0 ? (
                  rankings.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.posicion}</td>
                      <td>
                        {item.nombres} {item.apellidos}
                      </td>
                      <td>{item.githubUsername || "-"}</td>
                      <td>{item.sede || "-"}</td>
                      <td>
                        <span className="badge neutral">{item.area}</span>
                      </td>
                      <td>{item.score}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      No hay ranking generado para este evento y área.
                    </td>
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

function InfoCard({ titulo, valor }) {
  return (
    <div className="card">
      <p className="muted-text">{titulo}</p>
      <h2>{valor ?? 0}</h2>
    </div>
  );
}

export default AppRankingsPage;