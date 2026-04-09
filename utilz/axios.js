import axios from 'axios';
 const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${baseUrl}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -------- REQUEST INTERCEPTOR -------- */
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("token : ",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* -------- RESPONSE INTERCEPTOR -------- */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
