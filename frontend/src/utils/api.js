import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const shouldForceLocalApi =
  !rawApiUrl ||
  rawApiUrl.trim() === '' ||
  rawApiUrl.includes('localhost:5000');

const API_URL = shouldForceLocalApi
  ? 'http://localhost:3001/api'
  : rawApiUrl;

if (shouldForceLocalApi) {
  console.warn(
    '[API] VITE_API_URL is missing or points to port 5000. Defaulting to http://localhost:3001/api'
  );
}

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

