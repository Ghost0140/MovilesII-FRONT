import api from "./axios";

export const getRankingArea = async (eventoId, area) => {
  const response = await api.get(`/radar/rankings/${eventoId}/${area}`);
  return response.data;
};