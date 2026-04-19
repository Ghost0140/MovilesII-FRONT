import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getMiRadar } from "../../api/appRadar";

function RadarAlumnoPage() {
  const [radar, setRadar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarRadar = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMiRadar();
      setRadar(data);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.response?.data?.message ||
          "No se pudo cargar tu Talent Radar"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRadar();
  }, []);

  const parseTecnologias = (texto) => {
    if (!texto) return null;

    try {
      return JSON.parse(texto);
    } catch {
      return null;
    }
  };

  const getEstadoClass = (estado) => {
    if (estado === "COMPLETADO") return "success";
    if (estado === "ERROR") return "danger";
    return "neutral";
  };

  const tecnologias = parseTecnologias(radar?.tecnologiasDetectadas);

  return (
    <div>
      <PageHeader
        title="Mi Talent Radar"
        description="Resumen de habilidades detectadas desde tus repositorios GitHub."
      />

      {loading ? (
        <div className="card">
          <p>Cargando Talent Radar...</p>
        </div>
      ) : error ? (
        <div className="card feedback-error">
          <p>{error}</p>
        </div>
      ) : !radar ? (
        <div className="card">
          <p>No hay información disponible.</p>
        </div>
      ) : (
        <>
          <div className="card mb-16">
            <div
              className="toolbar"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <h3>Estado del análisis</h3>
                <p className="muted-text">{radar.mensaje}</p>
              </div>

              <span
                className={`badge ${getEstadoClass(radar.estado)}`}
                style={{
                  width: "fit-content",
                  minWidth: "auto",
                  height: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}
              >
                {radar.estado}
              </span>
            </div>

            {radar.repositorioUrl ? (
              <p className="mt-12 truncate-cell">
                <strong>Repositorio:</strong> {radar.repositorioUrl}
              </p>
            ) : (
              <p className="mt-12 muted-text">
                Todavía no tienes un repositorio analizado.
              </p>
            )}
          </div>

          <div className="stats-grid mb-16">
            <ScoreCard titulo="Frontend" valor={radar.radarFrontend} />
            <ScoreCard titulo="Backend" valor={radar.radarBackend} />
            <ScoreCard titulo="BD" valor={radar.radarBd} />
            <ScoreCard titulo="Mobile" valor={radar.radarMobile} />
            <ScoreCard titulo="Testing" valor={radar.radarTesting} />
          </div>

          <div className="stats-grid mb-16">
            <InfoCard titulo="Commits Repo" valor={radar.totalCommits ?? 0} />
            <InfoCard titulo="Mis Commits" valor={radar.commitsUsuario ?? 0} />
            <InfoCard
              titulo="Contributors GitHub"
              valor={radar.contributorsGithub ?? 0}
            />
            <InfoCard
              titulo="Usuarios Mapeados"
              valor={radar.usuariosMapeados ?? 0}
            />
          </div>

          <div className="card">
            <h3>Tecnologías detectadas</h3>

            {!tecnologias ? (
              <p className="muted-text mt-12">
                Todavía no hay tecnologías detectadas para mostrar.
              </p>
            ) : (
              <>
                {Array.isArray(tecnologias.lenguajes) &&
                tecnologias.lenguajes.length > 0 ? (
                  <div className="table-wrapper mt-12">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Lenguaje</th>
                          <th>Nivel</th>
                          <th>Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tecnologias.lenguajes.map((item, index) => (
                          <tr key={index}>
                            <td>{item.nombre}</td>
                            <td>
                              <span className="badge neutral">
                                {item.nivel}
                              </span>
                            </td>
                            <td>{item.porcentaje}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted-text mt-12">
                    No se detectaron lenguajes principales.
                  </p>
                )}

                {Array.isArray(tecnologias.pistasRepositorio) &&
                  tecnologias.pistasRepositorio.length > 0 && (
                    <div className="mt-16">
                      <h4>Pistas del repositorio</h4>
                      <div className="actions-inline mt-12">
                        {tecnologias.pistasRepositorio.map((pista, index) => (
                          <span key={index} className="badge neutral">
                            {pista}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ScoreCard({ titulo, valor }) {
  return (
    <div className="card">
      <p className="muted-text">{titulo}</p>
      <h2>{valor ?? 0}</h2>
      <span className="badge neutral">score</span>
    </div>
  );
}

function InfoCard({ titulo, valor }) {
  return (
    <div className="card">
      <p className="muted-text">{titulo}</p>
      <h2>{valor}</h2>
    </div>
  );
}

export default RadarAlumnoPage;