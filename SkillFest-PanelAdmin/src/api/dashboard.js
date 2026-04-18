import axios from "axios";

export const getDashboardResumen = async () => {
  const token = localStorage.getItem("token");

  return await axios.get("http://localhost:9090/api/dashboard/resumen", { 
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};