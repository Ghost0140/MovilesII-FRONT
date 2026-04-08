import { useState } from "react";

const initialForm = {
  proyectoId: "",
  juradoId: "",
  criterioId: "",
  puntaje: "",
  comentario: "",
};

function EvaluacionFormModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      proyectoId: Number(form.proyectoId),
      juradoId: Number(form.juradoId),
      criterioId: Number(form.criterioId),
      puntaje: Number(form.puntaje),
      comentario: form.comentario.trim() || null,
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Crear evaluación</h3>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>ID Proyecto</label>
            <input
              name="proyectoId"
              type="number"
              min="1"
              value={form.proyectoId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Jurado</label>
            <input
              name="juradoId"
              type="number"
              min="1"
              value={form.juradoId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Criterio</label>
            <input
              name="criterioId"
              type="number"
              min="1"
              value={form.criterioId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Puntaje</label>
            <input
              name="puntaje"
              type="number"
              step="0.1"
              min="0"
              value={form.puntaje}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Comentario</label>
            <textarea
              name="comentario"
              rows="4"
              value={form.comentario}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EvaluacionFormModal;