import { useState } from "react";

function ResultadoCalculoModal({ open, onClose, onSubmit, loading }) {
  const [eventoId, setEventoId] = useState("");
  const [proyectoId, setProyectoId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      eventoId: Number(eventoId),
      proyectoId: Number(proyectoId),
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Calcular resultado</h3>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>ID Evento</label>
            <input
              type="number"
              min="1"
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Proyecto</label>
            <input
              type="number"
              min="1"
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Calculando..." : "Calcular"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResultadoCalculoModal;