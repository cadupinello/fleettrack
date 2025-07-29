import axios from 'axios';
import Cookies from 'nookies';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true
  },
});

// Interceptor para adicionar token, se necessário
api.interceptors.request.use((config) => {
  const cookies = Cookies.get();
  const token = cookies?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

