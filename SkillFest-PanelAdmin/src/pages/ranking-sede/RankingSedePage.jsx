import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import UiIcon from "../../components/UiIcon";
import { getRankingSede } from "../../api/rankingSede";
import { getEventos } from "../../api/eventos";

function RankingSedePage() {
  const [eventoId, setEventoId] = useState("");
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventosLista, setEventosLista] = useState([]);

  const cargarRanking = useCallback(async () => {
    if (!eventoId) {
      setRanking([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getRankingSede(eventoId);
      const data = response.data || [];
      setRanking(data);
    } catch (err) {
      setRanking([]);
      setError(
        err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo cargar ranking de sedes"
      );
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    const cargarListaEventos = async () => {
      try {
        const response = await getEventos();
        const data = response.data || response || [];
        setEventosLista(data);
        if (data.length > 0) {
          setEventoId((actual) => actual || String(data[0].id));
        }
      } catch (err) {
        console.error("No se pudo cargar la lista de eventos", err);
        setEventosLista([]);
      }
    };

    cargarListaEventos();
  }, []);

  useEffect(() => {
    cargarRanking();
  }, [cargarRanking]);

  return (
    <div>
      <PageHeader
        title="Ranking por Sede"
        description="Vista analitica con desempeno por campus."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Evento</label>
            <select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
              <option value="">Seleccione un evento</option>
              {eventosLista.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary action-btn" onClick={cargarRanking}>
              <UiIcon name="map" className="button-svg" />
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
                  <th>Posicion</th>
                  <th>Sede</th>
                  <th>Puntos</th>
                  <th>Proyectos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length > 0 ? (
                  ranking.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <span className="rank-position">{item.posicion ?? index + 1}</span>
                      </td>
                      <td>{item.sedeNombre || "-"}</td>
                      <td>{item.puntosTotales ?? "-"}</td>
                      <td>{item.proyectosPresentados ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay ranking de sedes generado para este evento.</td>
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
