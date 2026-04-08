import api from "./axios";

export const getProyectos = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/proyectos", {
    params: { page, size },
  });
  return response.data;
};

export const aprobarProyecto = async (id) => {
  const response = await api.post(`/proyectos/${id}/aprobar`);
  return response.data;
};

export const rechazarProyecto = async (id) => {
  const response = await api.post(`/proyectos/${id}/rechazar`);
  return response.data;
};

export const cambiarEstadoProyecto = async (id, estado) => {
  const response = await api.patch(`/proyectos/${id}/estado`, { estado });
  return response.data;
};

export const analizarRadarProyecto = async (id) => {
  const response = await api.post(`/proyectos/${id}/analizar-radar`);
  return response.data;
};