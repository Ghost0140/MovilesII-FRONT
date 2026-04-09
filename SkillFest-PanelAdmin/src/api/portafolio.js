import api from "./axios";

export const getPortafolios = async () => {
  const response = await api.get("/portafolios");
  return response.data;
};

export const cambiarEstadoPortafolio = async (id, payload) => {
  const response = await api.patch(`/portafolios/${id}/estado`, payload);
  return response.data;
};