import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

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
      const respuesta = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 403 || respuesta.status === 401) {
          const textResponse = await respuesta.text();
          let mensajeFinal = 'Tu cuenta está inactiva. Contacta al administrador.'; // Mensaje por defecto

          try {
            // Intentamos extraer el JSON
            const errorData = JSON.parse(textResponse);
            if (errorData.message) {
              mensajeFinal = errorData.message;
            }
          } catch {
            // Si no es JSON y hay texto, usamos el texto
            if (textResponse) {
              mensajeFinal = textResponse;
            }
          }
          
          // Lanzamos el error UNA SOLA VEZ, fuera del try-catch
          throw new Error(mensajeFinal);
        }
        throw new Error('Error al conectar con el servidor');
      }

      const data = await respuesta.json();

      console.log("DEBUG LOGIN - Respuesta completa:", data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRol', data.rol);
        localStorage.setItem('userEmail', data.email);
        
        const idParaGuardar = data.id || data.usuarioId;
        
        if (idParaGuardar) {
          localStorage.setItem('usuarioId', String(idParaGuardar));
          console.log("✅ ID guardado correctamente:", idParaGuardar);
        } else {
          console.error("❌ Ojo: El ID no llegó en el JSON del servidor");
        }

        navigate('/dashboard');
      }
      

    } catch (err) {
      setError(err.message);
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
          style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

      </form>
    </div>
  );
};

export default Login;