import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import EventoFormModal from "../../components/eventos/EventoFormModal";
import { getSedes } from "../../api/sedes";
import {
  cambiarEstadoEvento,
  createEvento,
  getEventos,
  updateEvento,
} from "../../api/eventos";

const estadosDisponibles = [
  "BORRADOR",
  "PUBLICADO",
  "EN_CURSO",
  "FINALIZADO",
  "CANCELADO",
  "ELIMINADO",
];

function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEvento, setSelectedEvento] = useState(null);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEventos();
      setEventos(response.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cargar eventos"
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
    cargarEventos();
    cargarSedes();
  }, []);

  const eventosFiltrados = useMemo(() => {
    if (!estadoFiltro) return eventos;
    return eventos.filter((evento) => evento.estado === estadoFiltro);
  }, [eventos, estadoFiltro]);

  const abrirCrear = () => {
    setModalMode("create");
    setSelectedEvento(null);
    setModalOpen(true);
  };

  const abrirEditar = (evento) => {
    setModalMode("edit");
    setSelectedEvento(evento);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedEvento(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (modalMode === "create") {
        await createEvento(payload);
      } else {
        await updateEvento(selectedEvento.id, payload);
      }

      cerrarModal();
      await cargarEventos();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo guardar el evento"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (id, estado) => {
    if (estado === "ELIMINADO" || estado === "CANCELADO") {
      const confirmar = window.confirm(
        `⚠️ ¿Estás totalmente seguro de marcar este evento como ${estado}? Esta acción afectará a todos los equipos y proyectos inscritos.`
      );
      if (!confirmar) return; // Si cancela, no hacemos nada
    }
    try {
      await cambiarEstadoEvento(id, estado);
      await cargarEventos();
    } catch (err) {
      alert(
        err?.response?.data?.detalle ||
          err?.message ||
          "No se pudo cambiar el estado"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Eventos"
        description="Gestión de eventos y cambio de estados."
      />

      <div className="card mb-16">
        <div className="toolbar">
          <div className="toolbar-group">
            <label>Filtrar por estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary" onClick={abrirCrear}>
              Nuevo evento
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando eventos...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Alcance</th>
                  <th>Fecha evento</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th>Editar</th>
                  <th>Estado nuevo</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id}>
                      <td>{evento.id}</td>
                      <td>{evento.nombre}</td>
                      <td>{evento.tipo}</td>
                      <td>{evento.alcance}</td>
                      <td>{evento.fechaEvento}</td>
                      <td>{evento.sedeOrganizadoraNombre || "-"}</td>
                      <td>
                        <span className="badge neutral">{evento.estado}</span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() => abrirEditar(evento)}
                        >
                          Editar
                        </button>
                      </td>
                      <td>
                        <select
                          className="inline-select"
                          value={evento.estado}
                          onChange={(e) =>
                            handleCambiarEstado(evento.id, e.target.value)
                          }
                        >
                          {estadosDisponibles.map((estado) => (
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
                    <td colSpan="9">No hay eventos disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EventoFormModal
        open={modalOpen}
        mode={modalMode}
        evento={selectedEvento}
        sedes={sedes}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}

export default EventosPage;