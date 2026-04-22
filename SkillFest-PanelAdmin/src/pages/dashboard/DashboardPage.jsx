import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getDashboardResumen } from "../../api/dashboard";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardResumen();
setDashboard(data);
      } catch (err) {
        setError(
          err?.response?.data?.detalle ||
            err?.message ||
            "No se pudo cargar el dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Resumen general del panel administrativo."
        />
        <div className="card">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Resumen general del panel administrativo."
        />
        <div className="card error-card">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general del panel administrativo."
      />

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Usuarios activos</span>
          <strong className="stat-value">{dashboard?.totalUsuariosActivos ?? 0}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Eventos</span>
          <strong className="stat-value">{dashboard?.totalEventos ?? 0}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Proyectos</span>
          <strong className="stat-value">{dashboard?.totalProyectos ?? 0}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h3>Top usuarios por radar</h3>
          {dashboard?.topUsuariosRadar?.length ? (
            <div className="simple-table">
              <div className="simple-table-head">
                <span>Usuario</span>
                <span>Área</span>
                <span>Score</span>
              </div>

              {dashboard.topUsuariosRadar.map((item, index) => (
                <div className="simple-table-row" key={`${item.usuarioId}-${index}`}>
                  <span>{item.usuarioNombre}</span>
                  <span>{item.area}</span>
                  <span>{item.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </section>

        <section className="card">
          <h3>Top sedes</h3>
          {dashboard?.topSedes?.length ? (
            <div className="simple-table">
              <div className="simple-table-head">
                <span>Sede</span>
                <span>Puntos</span>
                <span>Proyectos</span>
              </div>

              {dashboard.topSedes.map((item, index) => (
                <div className="simple-table-row" key={`${item.sedeId}-${index}`}>
                  <span>{item.sedeNombre}</span>
                  <span>{item.puntosTotales}</span>
                  <span>{item.proyectosPresentados}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </section>
      </div>

      <section className="card mt-20">
        <h3>Últimos eventos</h3>

        {dashboard?.ultimosEventos?.length ? (
          <div className="simple-table eventos-table">
            <div className="simple-table-head eventos-head">
              <span>Nombre</span>
              <span>Tipo</span>
              <span>Estado</span>
              <span>Fecha</span>
            </div>

            {dashboard.ultimosEventos.map((item, index) => (
              <div className="simple-table-row eventos-row" key={`${item.eventoId}-${index}`}>
                <span>{item.nombre}</span>
                <span>{item.tipo}</span>
                <span>{item.estado}</span>
                <span>{item.fechaEvento}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay eventos recientes.</p>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;