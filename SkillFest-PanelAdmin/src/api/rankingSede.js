import api from "./axios";

export const getRankingSede = async (eventoId) => {
  const response = await api.get(`/ranking-sedes/evento/${eventoId}`);
  return response.data;
};