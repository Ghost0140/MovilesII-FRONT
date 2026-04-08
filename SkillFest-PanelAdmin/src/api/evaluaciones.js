import api from "./axios";

export const getEvaluaciones = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/evaluaciones", {
    params: { page, size },
  });
  return response.data;
};

export const createEvaluacion = async (payload) => {
  const response = await api.post("/evaluaciones", payload);
  return response.data;
};

export const deleteEvaluacion = async (id) => {
  const response = await api.delete(`/evaluaciones/${id}`);
  return response.data;
};