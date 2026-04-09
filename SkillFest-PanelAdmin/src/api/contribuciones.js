import api from "./axios";

export const getContribuciones = async () => {
  const response = await api.get("/contribuciones");
  return response.data;
};