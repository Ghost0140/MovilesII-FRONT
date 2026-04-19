import api from "./axios";

export const getMiRadar = async () => {
  const response = await api.get("/app/mi-radar");
  return response.data;
};