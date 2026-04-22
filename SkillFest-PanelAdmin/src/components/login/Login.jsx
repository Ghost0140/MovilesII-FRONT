import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await api.post("/auth/login", {
        email,
        password,
      });

      const data = respuesta.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRol", data.rol);
        localStorage.setItem("userEmail", data.email);

        const idParaGuardar = data.id || data.usuarioId;

        if (idParaGuardar) {
          localStorage.setItem("usuarioId", String(idParaGuardar));
        }

        navigate("/dashboard");
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-visual">
          <div className="login-overlay">
            <span className="login-badge">Panel administrativo</span>

            <div className="login-accent-line"></div>

            <h1 className="login-brand">SkillsFest</h1>

            <p className="login-description">
              Gestiona eventos, participantes, equipos, proyectos y rankings
              desde una sola plataforma.
            </p>

            <div className="login-features">
              <div>
                <strong>Eventos y ferias</strong>
                <span>Control centralizado de convocatorias y actividades.</span>
              </div>

              <div>
                <strong>Usuarios y roles</strong>
                <span>Acceso organizado según responsabilidades.</span>
              </div>

              <div>
                <strong>Seguimiento y rankings</strong>
                <span>Consulta indicadores clave del sistema.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-form-wrap">
            <span className="login-panel-label">Acceso seguro</span>

            <h2>Iniciar sesión</h2>

            <p className="login-panel-text">
              Ingresa con tu cuenta institucional autorizada.
            </p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin.ln@cibertec.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={cargando} className="login-btn">
                {cargando ? "Validando acceso..." : "Ingresar al panel"}
              </button>
            </form>

            <div className="login-footer">
              <span>SkillsFest Admin</span>
              <span>Acceso restringido</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;