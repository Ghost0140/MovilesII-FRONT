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

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && usuario) {
      setForm({
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        email: usuario.email || "",
        password: "",
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
  }, [open, mode, usuario]);

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
            sedeId: Number(form.sedeId),
            carrera: form.carrera.trim() || null,
            ciclo: form.ciclo ? Number(form.ciclo) : null,
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

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombres</label>
            <input
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </div>

          {mode === "create" ? (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Número de documento</label>
                <input
                  name="numeroDocumento"
                  value={form.numeroDocumento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Código estudiante</label>
                <input
                  name="codigoEstudiante"
                  value={form.codigoEstudiante}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : null}

          <div className="form-group">
            <label>Sede</label>
            <select
              name="sedeId"
              value={form.sedeId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Carrera</label>
            <input
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ciclo</label>
            <input
              name="ciclo"
              type="number"
              min="1"
              max="12"
              value={form.ciclo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>GitHub Username</label>
            <input
              name="githubUsername"
              value={form.githubUsername}
              onChange={handleChange}
            />
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