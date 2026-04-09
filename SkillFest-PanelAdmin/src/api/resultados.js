import api from "./axios";

export const getResultados = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/resultados", {
    params: { page, size },
  });
  return response.data;
};

export const calcularResultado = async (payload) => {
  const response = await api.post("/resultados/calcular", payload);
  return response.data;
};

export const publicarResultados = async (eventoId) => {
  const response = await api.post(`/resultados/publicar/${eventoId}`);
  return response.data;
};