import api from "./axios";

export const getUsuarios = async ({ page = 0, size = 10, activo = null } = {}) => {
  const params = { page, size };

  // Solo enviamos 'activo' si es explícitamente true o false, no ""
  if (activo !== null) {
  params.activo = activo;
}

  const response = await api.get("/usuarios", { params });
  return response.data; // Retorna el objeto { data: [...], totalPaginas: ... }
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