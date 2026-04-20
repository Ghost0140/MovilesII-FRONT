import api from "./axios";

export const getEquipos = async () => {
  const response = await api.get("/equipos");
  return response.data;
};

export const cambiarEstadoEquipo = async (id, estado) => {
  const response = await api.patch(`/equipos/${id}/estado`, { estado });
  return response.data;
};

export const aprobarEquipo = async (id, organizadorId) => {
  const response = await api.put(`/equipos/${id}/aprobar`, null, {
    params: { organizadorId },
  });
  return response.data;
};

export const inscribirEquipo = async (payload) => {
  const response = await api.post("/equipos/inscribir", payload);
  return response.data;
};