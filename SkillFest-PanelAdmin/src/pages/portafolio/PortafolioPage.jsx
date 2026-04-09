import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  cambiarEstadoPortafolio,
  getPortafolios,
} from "../../api/portafolio";

function PortafolioPage() {
  const [portafolios, setPortafolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarPortafolios = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPortafolios();
      setPortafolios(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar portafolios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPortafolios();
  }, []);

  const handleToggle = async (item, field) => {
    try {
      await cambiarEstadoPortafolio(item.id, {
        activo: field === "activo" ? !item.activo : item.activo,
        visible: field === "visible" ? !item.visible : item.visible,
      });
      await cargarPortafolios();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo actualizar el portafolio"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Portafolio Público"
        description="Visualización y control de visibilidad."
      />

      <div className="card">
        {loading ? (
          <p>Cargando portafolios...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Slug</th>
                  <th>Visible</th>
                  <th>Activo</th>
                  <th>Frontend</th>
                  <th>Backend</th>
                  <th>BD</th>
                  <th>Mobile</th>
                  <th>Testing</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {portafolios.length > 0 ? (
                  portafolios.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.usuarioNombre || "-"}</td>
                      <td>{item.slug || "-"}</td>
                      <td>
                        <span className={item.visible ? "badge success" : "badge danger"}>
                          {item.visible ? "Sí" : "No"}
                        </span>
                      </td>
                      <td>
                        <span className={item.activo ? "badge success" : "badge danger"}>
                          {item.activo ? "Sí" : "No"}
                        </span>
                      </td>
                      <td>{item.radarFrontend ?? "-"}</td>
                      <td>{item.radarBackend ?? "-"}</td>
                      <td>{item.radarBd ?? "-"}</td>
                      <td>{item.radarMobile ?? "-"}</td>
                      <td>{item.radarTesting ?? "-"}</td>
                      <td>
                        <div className="actions-inline">
                          <button
                            className="btn-secondary"
                            onClick={() => handleToggle(item, "visible")}
                          >
                            {item.visible ? "Ocultar" : "Mostrar"}
                          </button>
                          <button
                            className={item.activo ? "btn-danger" : "btn-primary"}
                            onClick={() => handleToggle(item, "activo")}
                          >
                            {item.activo ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">No hay portafolios disponibles.</td>
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

export default PortafolioPage;