import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getEventosPublicados } from "../../api/eventos";
import { inscribirEquipo } from "../../api/equipos";
import InscribirFormModal from "../../components/inscribir/InscribirFormModal";

function InscribirPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const res = await getEventosPublicados(); 
      
      // 👇 EL CAMBIO ESTÁ AQUÍ 👇
      // res es { mensaje: "...", data: [...] }
      // Por eso debemos guardar res.data
      setEventos(res.data || []); 
      
    } catch (err) { 
      console.error("Error al cargar eventos", err); 
      setEventos([]); // Seguridad: si falla, dejamos la lista vacía
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { cargarEventos(); }, []);

  const handleInscribirClick = (evento) => {
    setSelectedEvento(evento);
    setModalOpen(true);
  };

  const handleConfirmarInscripcion = async (payload) => {
    try {
        setSaving(true);
        await inscribirEquipo(payload);
        
        // El mensaje refuerza la idea de "Solicitud"
        alert("📩 Solicitud enviada con éxito.\n\nTu equipo ahora está en estado 'PENDIENTE'. El organizador del evento revisará los integrantes y aprobará su participación pronto.");
        
        setModalOpen(false);
    } catch (err) {
        alert(err.response?.data?.detalle || "No se pudo enviar la solicitud.");
    } finally {
        setSaving(false);
    }
    };

  return (
    <div>
      <PageHeader 
        title="Inscripción a Eventos" 
        description="Selecciona un evento activo y forma tu equipo para participar." 
      />

      <div className="stats-grid">
        {loading ? <p>Cargando eventos...</p> : 
          eventos.map(evento => (
            <div key={evento.id} className="card">
              <div className="badge success mb-8">{evento.tipo}</div>
              <h3>{evento.nombre}</h3>
              <p className="muted-text mb-12" style={{fontSize: '0.9rem'}}>
                📅 Inscripciones hasta: {evento.fechaFinInscripcion}
              </p>
              <p className="mb-16">{evento.descripcion}</p>
              <button 
                className="btn-primary full-width"
                onClick={() => handleInscribirClick(evento)}
              >
                Inscribir mi Equipo
              </button>
            </div>
          ))
        }
      </div>

      {selectedEvento && (
        <InscribirFormModal 
          open={modalOpen}
          evento={selectedEvento}
          onClose={() => setModalOpen(false)}
          onSubmit={handleConfirmarInscripcion}
          loading={saving}
        />
      )}
    </div>
  );
}

export default InscribirPage;