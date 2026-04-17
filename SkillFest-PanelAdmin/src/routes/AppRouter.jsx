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
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="eventos" element={<EventosPage />} />
            <Route path="equipos" element={<EquiposPage />} />
            <Route path="evaluaciones" element={<EvaluacionesPage />} />
            <Route path="proyectos" element={<ProyectosPage />} />
            <Route path="portafolio" element={<PortafolioPage />} />
            <Route path="contribuciones" element={<ContribucionesPage />} />
            <Route path="repositorios" element={<RepositoriosPage />} />
            <Route path="ranking-area" element={<RankingAreaPage />} />
            <Route path="ranking-sede" element={<RankingSedePage />} />
            <Route path="resultados" element={<ResultadosPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;