import api from "./axios";
export const getCriteriosPorEvento = async (eventoId) => {
  const response = await api.get(`/criterios/evento/${eventoId}`);
  
  return response.data.data; 
};

export const getTodosLosCriterios = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/criterios", { params: { page, size } });
  return response.data;
};

export const createCriterio = async (payload) => {
  const response = await api.post("/criterios", payload);
  return response.data;
};