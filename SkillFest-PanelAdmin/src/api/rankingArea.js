import api from "./axios";

export const getRankingArea = async (eventoId, area) => {
  const response = await api.get(`/app/rankings/evento/${eventoId}/${area}`);
  return response.data;
};
