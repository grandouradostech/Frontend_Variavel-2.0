import axios from 'axios';

// URL da sua API FastAPI (confirme se a porta é 8000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

// Interceptor: Adiciona o Token a TODOS os pedidos automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;