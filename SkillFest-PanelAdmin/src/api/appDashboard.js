import api from "./axios";

export const getAppDashboard = async () => {
  const response = await api.get("/app/dashboard");
  return response.data;
};