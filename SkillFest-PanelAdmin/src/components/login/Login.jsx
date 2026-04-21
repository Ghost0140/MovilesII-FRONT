import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await api.post('/auth/login', {
        email,
        password,
      });

      const data = respuesta.data;

      console.log('DEBUG LOGIN - Respuesta completa:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRol', data.rol);
        localStorage.setItem('userEmail', data.email);

        const idParaGuardar = data.id || data.usuarioId;

        if (idParaGuardar) {
          localStorage.setItem('usuarioId', String(idParaGuardar));
          console.log('✅ ID guardado correctamente:', idParaGuardar);
        } else {
          console.error('❌ Ojo: El ID no llegó en el JSON del servidor');
        }

        navigate('/dashboard');
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        err.message ||
        'Error al conectar con el servidor';

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Iniciar Sesión en SkillsFest</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: '10px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;