import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../components/login/Login";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import EventosPage from "../pages/eventos/EventosPage";
import EquiposPage from "../pages/equipos/EquiposPage";
import EvaluacionesPage from "../pages/evaluaciones/EvaluacionesPage";
import ProyectosPage from "../pages/proyectos/ProyectosPage";
import PortafolioPage from "../pages/portafolio/PortafolioPage";
import ContribucionesPage from "../pages/contribuciones/ContribucionesPage";
import RepositoriosPage from "../pages/repositorios/RepositoriosPage";
import RankingAreaPage from "../pages/ranking-area/RankingAreaPage";
import RankingSedePage from "../pages/ranking-sede/RankingSedePage";
import ResultadosPage from "../pages/resultados/ResultadosPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* 🛡️ PRIMER ESCUDO: Verifica que tengas Token (Estás logueado) */}
        <Route element={<ProtectedRoute />}>
          
          {/* El AdminLayout envuelve todo para que el Menú/Sidebar siempre se vea */}
          <Route path="/" element={<AdminLayout />}>
            
            {/* 🟢 ZONA GENERAL: Cualquier logueado puede ver esto (Alumnos, Jurados, Admins) */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Puedes mover aquí otras rutas que quieras que vean todos (ej. su propio portafolio) */}
            <Route path="portafolio" element={<PortafolioPage />} />

            {/* 🔴 ZONA RESTRINGIDA: Solo Administradores (y/o Profesores) */}
            {/* Ajusta el texto 'ADMIN' según cómo esté escrito exactamente en tu Base de Datos */}
            <Route element={<ProtectedRoute rolesPermitidos={['ADMIN', 'PROFESOR']} />}>
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="eventos" element={<EventosPage />} />
              <Route path="equipos" element={<EquiposPage />} />
              <Route path="proyectos" element={<ProyectosPage />} />
              <Route path="contribuciones" element={<ContribucionesPage />} />
              <Route path="repositorios" element={<RepositoriosPage />} />
              <Route path="ranking-area" element={<RankingAreaPage />} />
              <Route path="ranking-sede" element={<RankingSedePage />} />
            </Route>

            {/* 🔵 ZONA JURADOS: Ejemplo de cómo separar otra área en el futuro */}
            <Route element={<ProtectedRoute rolesPermitidos={['ADMIN', 'JURADO']} />}>
               <Route path="evaluaciones" element={<EvaluacionesPage />} />
               <Route path="resultados" element={<ResultadosPage />} />
            </Route>

          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;