import api from "./axios";

export const getUsuarios = async ({ page = 0, size = 10, activo = "" } = {}) => {
  const params = { page, size };

  if (activo !== "") {
    params.activo = activo;
  }

  const response = await api.get("/usuarios", { params });
  return response.data;
};

export const createUsuario = async (payload) => {
  const response = await api.post("/usuarios", payload);
  return response.data;
};

export const updateUsuario = async (id, payload) => {
  const response = await api.put(`/usuarios/${id}`, payload);
  return response.data;
};

export const cambiarActivoUsuario = async (id, activo) => {
  const response = await api.patch(`/usuarios/${id}/activo`, { activo });
  return response.data;
};