import { useEffect, useState } from "react";

const initialForm = {
  nombres: "",
  apellidos: "",
  email: "",
  password: "",
  numeroDocumento: "",
  sedeId: "",
  carrera: "",
  ciclo: "",
  codigoEstudiante: "",
  githubUsername: "",
};

const CARRERAS_CIBERTEC = [
  "Administración de redes",
  "Computación e informática",
  "Animación digital",
  "Diseño gráfico",
  "Diseño de videojuegos",
];

function UsuarioFormModal({
  open,
  mode, 
  usuario,
  sedes,
  onClose,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    // Si el modal no está abierto, no hacemos nada
    if (!open) return;

    // ✅ La clave para evitar el error de ESLint es agrupar 
    // las actualizaciones o usar una lógica de limpieza.
    const inicializarData = () => {
      setErrores({}); // Limpiamos errores previos

      if (mode === "edit" && usuario) {
        setForm({
          nombres: usuario.nombres || "",
          apellidos: usuario.apellidos || "",
          email: usuario.email || "",
          password: "", // Password siempre vacío en edición por seguridad
          numeroDocumento: usuario.numeroDocumento || "",
          sedeId: usuario.sedeId || "",
          carrera: usuario.carrera || "",
          ciclo: usuario.ciclo || "",
          codigoEstudiante: usuario.codigoEstudiante || "",
          githubUsername: usuario.githubUsername || "",
        });
      } else {
        setForm(initialForm);
      }
    };

    inicializarData();
  }, [open, mode, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errores[name]) {
        setErrores({
          ...errores,
          [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Nombres y Apellidos (Solo letras)
    const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!form.nombres.trim()) {
      nuevosErrores.nombres = "Los nombres son obligatorios.";
    } else if (!letrasRegex.test(form.nombres)) {
      nuevosErrores.nombres = "Los nombres solo pueden contener letras.";
    }

    if (!form.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    } else if (!letrasRegex.test(form.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos solo pueden contener letras.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(form.email)) {
      nuevosErrores.email = "Ingresa un correo válido (ej: admin@cibertec.edu.pe).";
    }

    if (mode === "create") {
      if (!form.password) {
        nuevosErrores.password = "La contraseña es obligatoria.";
      } else if (form.password.length < 6) {
        nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
      }
    }

    // DNI (8) o Carné de Extranjería (9)
    const documentoRegex = /^[0-9]{8,9}$/;
    if (!form.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = "El número de documento es obligatorio.";
    } else if (!documentoRegex.test(form.numeroDocumento)) {
      nuevosErrores.numeroDocumento = "El documento debe tener 8 dígitos (DNI) o 9 dígitos (Carné de Extranjería).";
    }

    if (form.codigoEstudiante && !/^u[0-9]{9}$/i.test(form.codigoEstudiante)) {
      nuevosErrores.codigoEstudiante = "El formato debe ser 'u' seguido de 9 números.";
    }

    if (!form.sedeId) nuevosErrores.sedeId = "Debes seleccionar una sede.";

    // Carrera (Obligatoria)
    if (!form.carrera) nuevosErrores.carrera = "Debes seleccionar una carrera.";

    if (form.ciclo) {
      const cicloNum = Number(form.ciclo);
      if (cicloNum < 1 || cicloNum > 6) {
        nuevosErrores.ciclo = "El ciclo debe estar entre 1 y 6.";
      }
    }

    if (form.githubUsername && /\s/.test(form.githubUsername)) {
      nuevosErrores.githubUsername = "El usuario de GitHub no puede contener espacios.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return; 
    }

    const payload =
      mode === "create"
        ? {
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            email: form.email.trim(),
            password: form.password,
            numeroDocumento: form.numeroDocumento.trim() || null,
            sedeId: Number(form.sedeId),
            carrera: form.carrera.trim() || null,
            ciclo: form.ciclo ? Number(form.ciclo) : null,
            codigoEstudiante: form.codigoEstudiante.trim() || null,
            githubUsername: form.githubUsername.trim() || null,
          }
        : {
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            email: form.email.trim(),
            numeroDocumento: form.numeroDocumento.trim() || null,
            sedeId: Number(form.sedeId),
            carrera: form.carrera.trim() || null,
            ciclo: form.ciclo ? Number(form.ciclo) : null,
            codigoEstudiante: form.codigoEstudiante.trim() || null,
            githubUsername: form.githubUsername.trim() || null,
          };

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{mode === "create" ? "Crear usuario" : "Editar usuario"}</h3>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {mode === "edit" && usuario && !usuario.activo && (
          <div className="card mb-16" style={{ backgroundColor: "#fff3cd", color: "#856404", padding: "10px", border: "1px solid #ffeeba", borderRadius: "4px" }}>
            <strong>Atención:</strong> Estás editando a un usuario que actualmente se encuentra <strong>Inactivo</strong>.
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <div className="form-group">
            <label>Nombres</label>
            <input
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className={errores.nombres ? "input-error" : ""}
            />
            {errores.nombres && <span className="error-text">{errores.nombres}</span>}
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              className={errores.apellidos ? "input-error" : ""}
            />
            {errores.apellidos && <span className="error-text">{errores.apellidos}</span>}
          </div>

          <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={errores.email ? "input-error" : ""}
              />
              {errores.email && <span className="error-text">{errores.email}</span>}
          </div>

          {mode === "create" ? (
            <>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={errores.password ? "input-error" : ""}
                />
                {errores.password && <span className="error-text">{errores.password}</span>}
              </div>

              <div className="form-group">
                <label>Número de documento</label>
                <input
                  name="numeroDocumento"
                  value={form.numeroDocumento}
                  onChange={handleChange}
                  className={errores.numeroDocumento ? "input-error" : ""}
                />
                {errores.numeroDocumento && <span className="error-text">{errores.numeroDocumento}</span>}
              </div>

              <div className="form-group">
                <label>Código estudiante</label>
                <input
                  name="codigoEstudiante"
                  value={form.codigoEstudiante}
                  onChange={handleChange}
                  className={errores.codigoEstudiante ? "input-error" : ""}
                  placeholder="u202212345"
                />
                {errores.codigoEstudiante && <span className="error-text">{errores.codigoEstudiante}</span>}
              </div>
            </>
          ) : null}

          <div className="form-group">
            <label>Sede</label>
            <select
              name="sedeId"
              value={form.sedeId}
              onChange={handleChange}
              className={errores.sedeId ? "input-error" : ""}
            >
              <option value="">Seleccione</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
            {errores.sedeId && <span className="error-text">{errores.sedeId}</span>}
          </div>

          <div className="form-group">
            <label>Carrera</label>
            <select
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              className={errores.carrera ? "input-error" : ""}
            >
              <option value="">Seleccione una carrera</option>
              {CARRERAS_CIBERTEC.map((carreraOp, index) => (
                <option key={index} value={carreraOp}>
                  {carreraOp}
                </option>
              ))}
            </select>
            {errores.carrera && <span className="error-text">{errores.carrera}</span>}
          </div>

          <div className="form-group">
            <label>Ciclo</label>
            <input
              name="ciclo"
              type="number"
              min="1"
              max="6"
              value={form.ciclo}
              onChange={handleChange}
              className={errores.ciclo ? "input-error" : ""}
            />
            {errores.ciclo && <span className="error-text">{errores.ciclo}</span>}
          </div>

          <div className="form-group">
            <label>GitHub Username</label>
            <input
              name="githubUsername"
              value={form.githubUsername}
              onChange={handleChange}
              className={errores.githubUsername ? "input-error" : ""}
            />
            {errores.githubUsername && <span className="error-text">{errores.githubUsername}</span>}
          </div>

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

export default UsuarioFormModal;