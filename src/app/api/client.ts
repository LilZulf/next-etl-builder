import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8055/items", // Base URL for all API requests
  headers: {
    "Content-Type": "application/json",
  },
});

// You can also add interceptors if needed (e.g., for authentication)
axiosClient.interceptors.request.use(
  (config) => {
    // Modify config (e.g., add auth tokens) before request is sent
    const token = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Automatically return the data field
  },
  (error) => {
    return Promise.reject(error.response || error.message);
  }
);

export default axiosClient;
