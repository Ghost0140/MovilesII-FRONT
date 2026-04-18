import { Navigate, Outlet } from 'react-router-dom';

// Agregamos una prop opcional llamada 'rolesPermitidos'
const ProtectedRoute = ({ rolesPermitidos }) => {
  const token = localStorage.getItem('token');
  const userRol = localStorage.getItem('userRol') || '';

  // 1. VERIFICACIÓN DE IDENTIDAD (Tu código original)
  // Si no hay token, lo pateamos al login sin piedad.
  if (!token) {
    return <Navigate to="/" replace />; // Ajusta a '/login' si esa es tu ruta inicial
  }

  // 2. VERIFICACIÓN DE PERMISOS (El nuevo escudo)
  // Si le pasamos roles a esta ruta, verificamos que el usuario cumpla
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const tieneAcceso = rolesPermitidos.some(rol => userRol.includes(rol));

    if (!tieneAcceso) {
      // Si tiene token pero NO tiene el rol, lo mandamos a su panel general
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Todo está en orden: Tiene token y tiene el rol (o la ruta no pedía rol).
  return <Outlet />;
};

export default ProtectedRoute;