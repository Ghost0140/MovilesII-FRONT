import api from "./axios";

export const getRepositorios = async () => {
  const response = await api.get("/repositorios");
  return response.data;
};

export const reanalizarRepositorio = async (proyectoId) => {
  const response = await api.post(`/repositorios/proyecto/${proyectoId}/reanalizar`);
  return response.data;
};