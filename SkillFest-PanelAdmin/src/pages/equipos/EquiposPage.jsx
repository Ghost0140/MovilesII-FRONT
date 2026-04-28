import { useEffect, useMemo, useState, useCallback } from "react";
import PageHeader from "../../components/PageHeader";
import UiIcon from "../../components/UiIcon";
import { aprobarEquipo, cambiarEstadoEquipo, getEquipos } from "../../api/equipos";

const estadosEquipo = ["PENDIENTE", "APROBADO", "RECHAZADO"];

function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // 1. Agrega useCallback a tu import de react
// ... dentro de tu componente EquiposPage ...

  const cargarEquipos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getEquipos();
      
      // ✅ CORRECCIÓN: Usa setEquipos, no setUsuarios
      setEquipos(response.data || []); 
      
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
        err?.message ||
        "No se pudo cargar equipos"
      );
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías para que la función se memorice correctamente

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]); // ✅ Ahora cargarEquipos es una dependencia válida y segura

  const equiposFiltrados = useMemo(() => {
    if (!estadoFiltro) return equipos;
    return equipos.filter((e) => e.estado === estadoFiltro);
  }, [equipos, estadoFiltro]);

  const handleCambiarEstado = async (equipoId, estado) => {
    try {
      await cambiarEstadoEquipo(equipoId, estado);
      await cargarEquipos();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cambiar el estado"
      );
    }
  };

  const handleAprobar = async (equipoId) => {
    try {
      // 🛡️ SEGURIDAD: Sacamos el ID real del administrador logueado
      const adminId = localStorage.getItem("usuarioId");
      
      if (!adminId) {
        alert("Error: No se detectó tu sesión de administrador. Reintenta el login.");
        return;
      }

      // Enviamos el ID real al backend
      await aprobarEquipo(equipoId, Number(adminId));
      await cargarEquipos();
      
    } catch (err) {
      alert(err?.response?.data?.detalle || err?.message || "No se pudo aprobar el equipo");
    }
  };

  return (
    <div>
      <PageHeader
        title="Equipos"
        description="Revisión y control de equipos."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Filtrar por estado</label>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">Todos</option>
              {estadosEquipo.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando equipos...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Evento</th>
                  <th>Sede</th>
                  <th>Líder</th>
                  <th>Asesor</th>
                  <th>Estado</th>
                  <th>Aprobar</th>
                  <th>Nuevo estado</th>
                </tr>
              </thead>
              <tbody>
                {equiposFiltrados.length > 0 ? (
                  equiposFiltrados.map((equipo) => (
                    <tr key={equipo.id}>
                      <td>{equipo.id}</td>
                      <td>{equipo.nombre}</td>
                      <td>{equipo.eventoNombre || "-"}</td>
                      <td>{equipo.sedeNombre || "-"}</td>
                      <td>{equipo.liderNombre || "-"}</td>
                      <td>{equipo.asesorNombre || "-"}</td>
                      <td>
                        <span className="badge neutral">{equipo.estado}</span>
                      </td>
                      <td>
                        <button
                          className="btn-primary action-btn"
                          onClick={() => handleAprobar(equipo.id)}
                          disabled={equipo.estado === "APROBADO"}
                        >
                          <UiIcon name="check" className="button-svg" />
                          Aprobar
                        </button>
                      </td>
                      <td>
                        <select
                          className="inline-select"
                          value={equipo.estado}
                          onChange={(e) =>
                            handleCambiarEstado(equipo.id, e.target.value)
                          }
                        >
                          {estadosEquipo.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No hay equipos disponibles.</td>
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

export default EquiposPage;
