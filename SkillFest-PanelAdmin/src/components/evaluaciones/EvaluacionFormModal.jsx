import { useState, useMemo, useEffect } from "react";
import { getCriteriosPorEvento } from "../../api/criterios";

const initialForm = {
  proyectoId: "",
  juradoId: "", 
  criterioId: "",
  puntaje: "",
  comentario: "",
};

function EvaluacionFormModal({ open, onClose, onSubmit, loading, proyectos = [] }) {
  const [form, setForm] = useState(initialForm);
  const [criteriosList, setCriteriosList] = useState([]); 
  // 👇 Capturamos el nombre de la memoria del navegador
  const juradoNombre = localStorage.getItem("userName") || "Profesor Jurado";

  const proyectoSeleccionado = useMemo(() => {
    if (!form.proyectoId) return null;
    return proyectos.find((p) => p.id === Number(form.proyectoId));
  }, [form.proyectoId, proyectos]);

  useEffect(() => {
    const cargarCriterios = async () => {
      if (!proyectoSeleccionado) {
        setCriteriosList([]);
        return;
      }
      const idDelEvento = proyectoSeleccionado.eventoId || (proyectoSeleccionado.evento && proyectoSeleccionado.evento.id);

      if (idDelEvento) {
        try {
          const data = await getCriteriosPorEvento(idDelEvento);
          setCriteriosList(data || []);
        } catch (error) {
          console.error("Error al cargar criterios del evento", error);
          setCriteriosList([]);
        }
      } else {
        setCriteriosList([]);
      }
    
      setForm(prev => ({ ...prev, criterioId: "" }));
    };

    cargarCriterios();
  }, [proyectoSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const idDelJurado = localStorage.getItem("usuarioId");

    if (!idDelJurado) {
      alert("Error: No se encontró tu ID de sesión. Por favor, cierra sesión y vuelve a ingresar.");
      return;
    }

    onSubmit({
      proyectoId: Number(form.proyectoId),
      juradoId: Number(idDelJurado),
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
          <h3>Evaluar Proyecto</h3>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {proyectoSeleccionado && (
          <div className="card mb-16" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>{proyectoSeleccionado.titulo || proyectoSeleccionado.nombre}</h4>
            {proyectoSeleccionado.repositorioUrl && (
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                <strong>Repositorio:</strong> <a href={proyectoSeleccionado.repositorioUrl} target="_blank" rel="noreferrer">{proyectoSeleccionado.repositorioUrl}</a>
              </p>
            )}
            <p style={{ margin: "0", fontSize: "13px", color: "#6c757d" }}>
              {proyectoSeleccionado.resumen || "Sin resumen disponible."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="form-group full-width">
            <label>Proyecto a evaluar</label>
            <select
              name="proyectoId"
              value={form.proyectoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un proyecto...</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo || p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Jurado Evaluador</label>
            <input
              type="text"
              value={juradoNombre}
              disabled 
              style={{ backgroundColor: "#e9ecef", cursor: "not-allowed", color: "#6c757d", fontWeight: "500" }}
            />
          </div>

          <div className="form-group">
            <label>Criterio de Evaluación</label>
            <select
              name="criterioId"
              value={form.criterioId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un criterio...</option>
              {criteriosList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} (Max: {c.puntajeMaximo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Puntaje asignado</label>
            <input
              name="puntaje"
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={form.puntaje}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Comentario (Retroalimentación)</label>
            <textarea
              name="comentario"
              rows="3"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Escribe observaciones para el equipo..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Evaluación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EvaluacionFormModal;