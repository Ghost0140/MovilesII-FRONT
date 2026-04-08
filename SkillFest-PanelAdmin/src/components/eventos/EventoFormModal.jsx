import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  descripcion: "",
  tipo: "FERIA",
  alcance: "SEDE",
  fechaInicioInscripcion: "",
  fechaFinInscripcion: "",
  fechaEvento: "",
  maxMiembrosEquipo: "",
  sedeOrganizadoraId: "",
  creadoPorId: "",
};

function EventoFormModal({
  open,
  mode,
  evento,
  sedes,
  onClose,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && evento) {
      setForm({
        nombre: evento.nombre || "",
        descripcion: evento.descripcion || "",
        tipo: evento.tipo || "FERIA",
        alcance: evento.alcance || "SEDE",
        fechaInicioInscripcion: evento.fechaInicioInscripcion || "",
        fechaFinInscripcion: evento.fechaFinInscripcion || "",
        fechaEvento: evento.fechaEvento || "",
        maxMiembrosEquipo: evento.maxMiembrosEquipo || "",
        sedeOrganizadoraId: evento.sedeOrganizadoraId || "",
        creadoPorId: "",
      });
    } else {
      setForm(initialForm);
    }
  }, [open, mode, evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload =
      mode === "create"
        ? {
            sedeOrganizadoraId: Number(form.sedeOrganizadoraId),
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            tipo: form.tipo,
            alcance: form.alcance,
            fechaInicioInscripcion: form.fechaInicioInscripcion,
            fechaFinInscripcion: form.fechaFinInscripcion,
            fechaEvento: form.fechaEvento,
            maxMiembrosEquipo: form.maxMiembrosEquipo
              ? Number(form.maxMiembrosEquipo)
              : null,
            creadoPorId: Number(form.creadoPorId),
          }
        : {
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            tipo: form.tipo,
            alcance: form.alcance,
            fechaInicioInscripcion: form.fechaInicioInscripcion,
            fechaFinInscripcion: form.fechaFinInscripcion,
            fechaEvento: form.fechaEvento,
            maxMiembrosEquipo: form.maxMiembrosEquipo
              ? Number(form.maxMiembrosEquipo)
              : null,
          };

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{mode === "create" ? "Crear evento" : "Editar evento"}</h3>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} required>
              <option value="FERIA">FERIA</option>
              <option value="HACKATHON">HACKATHON</option>
              <option value="CONCURSO">CONCURSO</option>
              <option value="EXPOSICION">EXPOSICION</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Alcance</label>
            <select
              name="alcance"
              value={form.alcance}
              onChange={handleChange}
              required
            >
              <option value="SEDE">SEDE</option>
              <option value="TODAS_SEDES">TODAS_SEDES</option>
              <option value="INTER_SEDES">INTER_SEDES</option>
            </select>
          </div>

          <div className="form-group">
            <label>Máx. miembros</label>
            <input
              name="maxMiembrosEquipo"
              type="number"
              min="1"
              value={form.maxMiembrosEquipo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha inicio inscripción</label>
            <input
              name="fechaInicioInscripcion"
              type="date"
              value={form.fechaInicioInscripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha fin inscripción</label>
            <input
              name="fechaFinInscripcion"
              type="date"
              value={form.fechaFinInscripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha evento</label>
            <input
              name="fechaEvento"
              type="date"
              value={form.fechaEvento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sede organizadora</label>
            <select
              name="sedeOrganizadoraId"
              value={form.sedeOrganizadoraId}
              onChange={handleChange}
              required
              disabled={mode === "edit"}
            >
              <option value="">Seleccione</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          {mode === "create" ? (
            <div className="form-group">
              <label>ID creador</label>
              <input
                name="creadoPorId"
                type="number"
                min="1"
                value={form.creadoPorId}
                onChange={handleChange}
                required
              />
            </div>
          ) : null}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Guardando..."
                : mode === "create"
                ? "Crear"
                : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventoFormModal;