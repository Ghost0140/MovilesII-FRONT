import api from "./axios";

export const getAreasRanking = async () => {
  const response = await api.get("/app/rankings/areas");
  return response.data;
};

export const getRankingPorEventoYArea = async (eventoId, area) => {
  const response = await api.get(`/app/rankings/evento/${eventoId}/${area}`);
  return response.data;
};

export const generarRankingsEvento = async (eventoId) => {
  const response = await api.post(`/app/admin/rankings/generar/${eventoId}`);
  return response.data;
};

export const getStatusRankingsEvento = async (eventoId) => {
  const response = await api.get(`/app/admin/rankings/status/${eventoId}`);
  return response.data;
};