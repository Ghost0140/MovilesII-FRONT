import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  getRepositorios,
  reanalizarRepositorio,
} from "../../api/repositorios";

function RepositoriosPage() {
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarRepositorios = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRepositorios();
      setRepositorios(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar repositorios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRepositorios();
  }, []);

  const handleReanalizar = async (proyectoId) => {
    try {
      await reanalizarRepositorio(proyectoId);
      await cargarRepositorios();
      alert("Repositorio reanalizado correctamente.");
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo reanalizar"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Repositorios"
        description="Vista de repositorios y reanálisis."
      />

      <div className="card">
        {loading ? (
          <p>Cargando repositorios...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proyecto</th>
                  <th>URL</th>
                  <th>Plataforma</th>
                  <th>Commits</th>
                  <th>Lenguajes</th>
                  <th>Último análisis</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {repositorios.length > 0 ? (
                  repositorios.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.proyectoTitulo || item.proyectoId}</td>
                      <td className="truncate-cell">{item.url || "-"}</td>
                      <td>{item.plataforma || "-"}</td>
                      <td>{item.totalCommits ?? "-"}</td>
                      <td className="truncate-cell">{item.lenguajes || "-"}</td>
                      <td>{item.ultimoAnalisis || "-"}</td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() => handleReanalizar(item.proyectoId)}
                        >
                          Reanalizar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No hay repositorios disponibles.</td>
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

export default RepositoriosPage;