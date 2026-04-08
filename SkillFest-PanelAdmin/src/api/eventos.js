import api from "./axios";

export const getEventos = async () => {
  const response = await api.get("/eventos");
  return response.data;
};

export const createEvento = async (payload) => {
  const response = await api.post("/eventos", payload);
  return response.data;
};

export const updateEvento = async (id, payload) => {
  const response = await api.put(`/eventos/${id}`, payload);
  return response.data;
};

export const cambiarEstadoEvento = async (id, estado) => {
  const response = await api.patch(`/eventos/${id}/estado`, { estado });
  return response.data;
};