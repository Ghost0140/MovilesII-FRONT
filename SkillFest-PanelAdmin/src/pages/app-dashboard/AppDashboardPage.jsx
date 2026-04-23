import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getAppDashboard } from "../../api/appDashboard";

function AppDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppDashboard();
      setDashboard(data);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          "No se pudo cargar el dashboard de la app"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard App"
        description="Resumen del flujo del alumno para la app móvil."
      />

      {loading ? (
        <div className="card">
          <p>Cargando dashboard...</p>
        </div>
      ) : error ? (
        <div className="card feedback-error">
          <p>{error}</p>
        </div>
      ) : !dashboard ? (
        <div className="card">
          <p>No hay información disponible.</p>
        </div>
      ) : (
        <>
          <div className="card mb-16">
            <h3>
              {dashboard.usuario?.nombres} {dashboard.usuario?.apellidos}
            </h3>
            <p className="muted-text">{dashboard.usuario?.email}</p>
            <p className="muted-text">
              Rol: {dashboard.usuario?.roles} | Sede:{" "}
              {dashboard.usuario?.sede || "-"}
            </p>
          </div>

          <div className="stats-grid mb-16">
            <InfoCard
              titulo="Eventos activos"
              valor={dashboard.resumen?.totalEventosActivos ?? 0}
            />
            <InfoCard
              titulo="Mis proyectos"
              valor={dashboard.resumen?.totalMisProyectos ?? 0}
            />
            <InfoCard
              titulo="Enviados"
              valor={dashboard.resumen?.totalProyectosEnviados ?? 0}
            />
            <InfoCard
              titulo="Aprobados"
              valor={dashboard.resumen?.totalProyectosAprobados ?? 0}
            />
          </div>

          <div className="card mb-16">
            <div className="toolbar" style={{ justifyContent: "space-between" }}>
              <div>
                <h3>Resumen Talent Radar</h3>
                <p className="muted-text">{dashboard.radar?.mensaje}</p>
              </div>
              <span className="badge neutral">{dashboard.radar?.estado}</span>
            </div>

            <div className="stats-grid mt-16">
              <InfoCard titulo="Frontend" valor={dashboard.radar?.frontend} />
              <InfoCard titulo="Backend" valor={dashboard.radar?.backend} />
              <InfoCard titulo="BD" valor={dashboard.radar?.bd} />
              <InfoCard titulo="Mobile" valor={dashboard.radar?.mobile} />
              <InfoCard titulo="Testing" valor={dashboard.radar?.testing} />
            </div>
          </div>

          <div className="card mb-16">
            <h3>Eventos activos</h3>

            <div className="table-wrapper mt-12">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Evento</th>
                    <th>Tipo</th>
                    <th>Alcance</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.eventosActivos?.length > 0 ? (
                    dashboard.eventosActivos
                      .filter((evento) => evento.estado === "PUBLICADO" || evento.estado === "ACTIVO")
                      .map((evento) => (
                      <tr key={evento.id}>
                        <td>{evento.id}</td>
                        <td>{evento.nombre}</td>
                        <td>{evento.tipo}</td>
                        <td>{evento.alcance}</td>
                        <td>
                          <span className="badge neutral">
                            {evento.estado}
                          </span>
                        </td>
                        <td>{evento.fechaEvento}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No hay eventos activos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Mis proyectos</h3>

            <div className="table-wrapper mt-12">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Proyecto</th>
                    <th>Evento</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Repositorio</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.misProyectos?.length > 0 ? (
                    dashboard.misProyectos.map((proyecto) => (
                      <tr key={proyecto.id}>
                        <td>{proyecto.id}</td>
                        <td>{proyecto.titulo}</td>
                        <td>{proyecto.eventoNombre || "-"}</td>
                        <td>
                          <span className="badge neutral">
                            {proyecto.tipoParticipacion}
                          </span>
                        </td>
                        <td>
                          <span className="badge neutral">
                            {proyecto.estado}
                          </span>
                        </td>
                        <td className="truncate-cell">
                          {proyecto.repositorioUrl || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No tienes proyectos registrados.</td>
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

function InfoCard({ titulo, valor }) {
  return (
    <div className="card">
      <p className="muted-text">{titulo}</p>
      <h2>{valor ?? 0}</h2>
    </div>
  );
}

export default AppDashboardPage;