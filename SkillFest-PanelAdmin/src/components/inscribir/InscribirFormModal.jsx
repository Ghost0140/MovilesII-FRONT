import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuarios";

function InscribirFormModal({ open, evento, onClose, onSubmit, loading }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]);
  const [asesorId, setAsesorId] = useState("");

  const miId = Number(localStorage.getItem("usuarioId"));

    useEffect(() => {
    if (open) {
        const cargarDatos = async () => {
        try {
            const response = await getUsuarios({ size: 100, activo: true });
            
            // Entramos a .data porque tu controlador de Spring así lo envía
            const listaCompleta = response.data || [];

            // 🛡️ Filtro robusto para ESTUDIANTES
            const soloEstudiantes = listaCompleta.filter(u => {
            const r = u.roles ? String(u.roles).toUpperCase() : "";
            // .includes es mejor que === porque maneja "ESTUDIANTE,BECARIO", etc.
            return r.includes("ESTUDIANTE") && u.id !== miId;
            });

            // 🛡️ Filtro para ASESORES (Buscamos Profesores u Organizadores)
            const soloAsesores = listaCompleta.filter(u => {
            const r = u.roles ? String(u.roles).toUpperCase() : "";
            return r.includes("PROFESOR") || r.includes("ORGANIZADOR");
            });

            setEstudiantes(soloEstudiantes);
            setAsesores(soloAsesores);

        } catch (err) {
            console.error("Error al cargar alumnos para inscripción:", err);
        }
        };
        cargarDatos();
    }
    }, [open, miId]);

  const handleCheckboxChange = (id) => {
    setMiembrosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de límites del evento
    const totalMiembros = 1 + miembrosSeleccionados.length; // Líder + Miembros
    if (evento.maxMiembrosEquipo && totalMiembros > evento.maxMiembrosEquipo) {
      alert(`El equipo supera el límite de ${evento.maxMiembrosEquipo} personas.`);
      return;
    }

    const payload = {
      eventoId: evento.id,
      nombreEquipo: nombreEquipo.trim(),
      liderId: miId,
      miembrosIds: miembrosSeleccionados,
      asesorId: asesorId ? Number(asesorId) : null
    };

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Solicitud de Inscripción</h3>
          <p className="muted-text">{evento.nombre}</p>
          <button onClick={onClose} className="icon-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* NOMBRE DEL EQUIPO */}
          <div className="form-group full-width">
            <label>Nombre del Equipo</label>
            <input 
              required 
              type="text"
              className="form-control"
              value={nombreEquipo} 
              onChange={(e) => setNombreEquipo(e.target.value)} 
              placeholder="Ej. Los Alpha Devs"
            />
          </div>

          {/* MIEMBROS */}
          <div className="form-group full-width">
            <label>Selecciona a tus compañeros (Máximo {evento.maxMiembrosEquipo - 1})</label>
            <div className="scrollable-list" style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
              {estudiantes.length > 0 ? estudiantes.map(est => (
                <label key={est.id} className="checkbox-label" style={{ display: 'flex', gap: '10px', padding: '5px 0', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={miembrosSeleccionados.includes(est.id)}
                    onChange={() => handleCheckboxChange(est.id)}
                  />
                  <span>{est.nombres} {est.apellidos}</span>
                </label>
              )) : <p className="muted-text">No hay otros estudiantes activos para seleccionar.</p>}
            </div>
          </div>

          {/* ASESOR */}
          <div className="form-group full-width">
            <label>Profesor Asesor (Opcional)</label>
            <select 
              className="form-control"
              value={asesorId} 
              onChange={(e) => setAsesorId(e.target.value)}
            >
              <option value="">-- Sin Asesor --</option>
              {asesores.map(as => (
                <option key={as.id} value={as.id}>
                  {as.nombres} {as.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions mt-16">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Enviando solicitud..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InscribirFormModal;