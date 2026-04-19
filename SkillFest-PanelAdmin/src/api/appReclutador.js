import api from "./axios";

export const getMejoresContribuidores = async ({ area = "", limit = 10 } = {}) => {
  const response = await api.get("/app/reclutador/mejores-contribuidores", {
    params: { area, limit },
  });
  return response.data;
};

export const getProyectosDestacados = async ({ limit = 10 } = {}) => {
  const response = await api.get("/app/reclutador/proyectos-destacados", {
    params: { limit },
  });
  return response.data;
};

export const getHistorialContribuidor = async (usuarioId) => {
  const response = await api.get(`/app/reclutador/contribuidor/${usuarioId}`);
  return response.data;
};