import axios from 'axios';

// URL da sua API FastAPI (confirme se a porta é 8000)
const api = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-variavel-2-0.onrender.com',
});

// Interceptor: Adiciona o Token a TODOS os pedidos automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const shouldInjectDateRange = (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') return false;

  const url = String(config.url || '');

  if (url.includes('/token')) return false;
  if (url.includes('/incentivo')) return false;

  if (config.headers && config.headers['X-Skip-Date-Filter']) return false;
  return true;
};

api.interceptors.request.use((config) => {
  if (!shouldInjectDateRange(config)) return config;

  const dataInicio = localStorage.getItem('global_data_inicio') || '';
  const dataFim = localStorage.getItem('global_data_fim') || '';
  if (!dataInicio || !dataFim) return config;

  const currentParams = config.params && typeof config.params === 'object' ? config.params : {};

  config.params = {
    data_inicio: currentParams.data_inicio ?? dataInicio,
    data_fim: currentParams.data_fim ?? dataFim,
    ...currentParams,
  };

  return config;
});

export default api;
