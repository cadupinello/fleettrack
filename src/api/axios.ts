import axios from 'axios';
import Cookies from 'nookies';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
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

