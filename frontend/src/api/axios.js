import axios from "axios";

const fallbackApiBaseUrl = "http://localhost:5000";
const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || fallbackApiBaseUrl;

const api = axios.create({
  baseURL: configuredBaseUrl.replace(/\/+$/, ""),
});

// Always attach the auth token when present.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
