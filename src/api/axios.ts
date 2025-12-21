import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Tentar pegar o token do nookies primeiro (universal)
  const cookies = parseCookies();
  let token = cookies.token;

  // Se estiver no browser e o nookies falhar, tentar ler direto do document.cookie
  if (!token && typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) token = match[2];
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
