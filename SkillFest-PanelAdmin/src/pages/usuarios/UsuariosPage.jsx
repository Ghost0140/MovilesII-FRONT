import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import UsuarioFormModal from "../../components/usuarios/UsuarioFormModal";
import {
  cambiarActivoUsuario,
  createUsuario,
  getUsuarios,
  updateUsuario,
} from "../../api/usuarios";
import { getSedes } from "../../api/sedes";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activoFiltro, setActivoFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsuarios({
        page,
        size: 10,
        activo: activoFiltro,
      });

      setUsuarios(response.data || []);
      setMeta({
        paginaActual: response.paginaActual ?? 0,
        totalPaginas: response.totalPaginas ?? 0,
        totalElementos: response.totalElementos ?? 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar usuarios"
      );
    } finally {
      setLoading(false);
    }
  };

  const cargarSedes = async () => {
    try {
      const response = await getSedes();
      setSedes(response.data || response || []);
    } catch {
      setSedes([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [page, activoFiltro]);

  useEffect(() => {
    cargarSedes();
  }, []);

  const abrirCrear = () => {
    setModalMode("create");
    setSelectedUsuario(null);
    setModalOpen(true);
  };

  const abrirEditar = (usuario) => {
    setModalMode("edit");
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (modalMode === "create") {
        await createUsuario(payload);
      } else {
        await updateUsuario(selectedUsuario.id, payload);
      }

      cerrarModal();
      await cargarUsuarios();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo guardar el usuario"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarActivo = async (usuario) => {

    if (usuario.activo){
      const confirmar = window.confirm(`¿Estás seguro de que deseas desactivar a ${usuario.nombres}? Perderá el acceso al sistema.`
    );
    if (!confirmar) return;
  }
    try {
      await cambiarActivoUsuario(usuario.id, !usuario.activo);
      await cargarUsuarios();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo actualizar el estado"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Gestión de usuarios del sistema."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Estado</label>
            <select
              value={activoFiltro}
              onChange={(e) => {
                setPage(0);
                setActivoFiltro(e.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary" onClick={abrirCrear}>
              Nuevo usuario
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Carrera</th>
                    <th>Ciclo</th>
                    <th>Sede</th>
                    <th>GitHub</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombres} {usuario.apellidos}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.carrera || "-"}</td>
                        <td>{usuario.ciclo || "-"}</td>
                        <td>{usuario.sedeNombre || "-"}</td>
                        <td>{usuario.githubUsername || "-"}</td>
                        <td>
                          <span className={usuario.activo ? "badge success" : "badge danger"}>
                            {usuario.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="actions-inline">
                            <button
                              className="btn-secondary"
                              onClick={() => abrirEditar(usuario)}
                            >
                              Editar
                            </button>

                            <button
                              className={usuario.activo ? "btn-danger" : "btn-primary"}
                              onClick={() => handleCambiarActivo(usuario)}
                            >
                              {usuario.activo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No hay usuarios disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Anterior
              </button>

              <span>
                Página {meta.paginaActual + 1} de {Math.max(meta.totalPaginas, 1)}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={meta.totalPaginas === 0 || page + 1 >= meta.totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      <UsuarioFormModal
        open={modalOpen}
        mode={modalMode}
        usuario={selectedUsuario}
        sedes={sedes}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}

export default UsuariosPage;