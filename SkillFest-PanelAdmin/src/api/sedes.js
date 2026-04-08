import api from "./axios";

export const getSedes = async () => {
  const response = await api.get("/sedes");
  return response.data;
};