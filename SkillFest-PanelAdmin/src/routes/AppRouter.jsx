import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../components/login/Login";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import EventosPage from "../pages/eventos/EventosPage";
import EquiposPage from "../pages/equipos/EquiposPage";
import ProyectosPage from "../pages/proyectos/ProyectosPage";
import ContribucionesPage from "../pages/contribuciones/ContribucionesPage";
import RepositoriosPage from "../pages/repositorios/RepositoriosPage";
import RankingAreaPage from "../pages/ranking-area/RankingAreaPage";
import RankingSedePage from "../pages/ranking-sede/RankingSedePage";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRedirect from "../components/RoleRedirect";

import RadarAlumnoPage from "../pages/radar/RadarAlumnoPage";
import AppRankingsPage from "../pages/app-rankings/AppRankingsPage";
import ReclutadorPage from "../pages/reclutador/ReclutadorPage";
import AppDashboardPage from "../pages/app-dashboard/AppDashboardPage";
import InscribirPage from "../pages/inscribir/InscribirPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<RoleRedirect />} />

            <Route path="dashboard" element={<DashboardPage />} />

            <Route
                element={
            <ProtectedRoute rolesPermitidos={["ESTUDIANTE"]} />
            }
            >
          <Route path="app-dashboard" element={<AppDashboardPage />} />
          <Route path="mi-radar" element={<RadarAlumnoPage />} />
          <Route path="inscribir" element={<InscribirPage />} />
          </Route>

            <Route element={<ProtectedRoute rolesPermitidos={["ADMIN", "ORGANIZADOR"]} />}>
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="eventos" element={<EventosPage />} />
              <Route path="equipos" element={<EquiposPage />} />
              <Route path="proyectos" element={<ProyectosPage />} />
              <Route path="contribuciones" element={<ContribucionesPage />} />
              <Route path="repositorios" element={<RepositoriosPage />} />
            </Route>

            <Route element={<ProtectedRoute rolesPermitidos={["ADMIN", "ORGANIZADOR", "JURADO"]} />}>
              <Route path="ranking-area" element={<RankingAreaPage />} />
              <Route path="ranking-sede" element={<RankingSedePage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  rolesPermitidos={["ADMIN", "ORGANIZADOR", "RECLUTADOR", "JURADO"]}
                />
              }
            >
              <Route path="app-rankings" element={<AppRankingsPage />} />
            </Route>

            <Route element={<ProtectedRoute rolesPermitidos={["ADMIN", "ORGANIZADOR", "RECLUTADOR"]} />}>
              <Route path="reclutador" element={<ReclutadorPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
