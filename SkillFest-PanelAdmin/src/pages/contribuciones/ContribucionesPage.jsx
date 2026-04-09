import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getContribuciones } from "../../api/contribuciones";

function ContribucionesPage() {
  const [contribuciones, setContribuciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarContribuciones = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getContribuciones();
      setContribuciones(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar contribuciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContribuciones();
  }, []);

  return (
    <div>
      <PageHeader
        title="Contribuciones"
        description="Visualización de aportes generados por el radar."
      />

      <div className="card">
        {loading ? (
          <p>Cargando contribuciones...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Repositorio</th>
                  <th>Commits</th>
                  <th>Líneas</th>
                  <th>Frontend</th>
                  <th>Backend</th>
                  <th>BD</th>
                  <th>Mobile</th>
                  <th>Testing</th>
                  <th>Analizado en</th>
                </tr>
              </thead>
              <tbody>
                {contribuciones.length > 0 ? (
                  contribuciones.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.usuarioNombre || "-"}</td>
                      <td className="truncate-cell">{item.repositorioUrl || "-"}</td>
                      <td>{item.totalCommits ?? "-"}</td>
                      <td>{item.totalLineas ?? "-"}</td>
                      <td>{item.scoreFrontend ?? "-"}</td>
                      <td>{item.scoreBackend ?? "-"}</td>
                      <td>{item.scoreBd ?? "-"}</td>
                      <td>{item.scoreMobile ?? "-"}</td>
                      <td>{item.scoreTesting ?? "-"}</td>
                      <td>{item.analizadoEn || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">No hay contribuciones disponibles.</td>
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

export default ContribucionesPage;