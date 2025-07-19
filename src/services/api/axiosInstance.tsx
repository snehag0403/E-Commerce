import axios from "axios";
import API_CONFIG from "../config/appConfig";
import useAuthStore from "../../stores/useAuthStore";
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { token } = useAuthStore.getState();

    if (token) config.headers.Authorization = `Bearer ${token}`;
    // console.log("dsifonsfjsff", config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error", error.response?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
