import axios from 'axios';

// A URL base vem do seu docker-compose.yml (VITE_API_URL)
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
});

// Interceptador: antes de qualquer requisição sair, ele injeta o token se existir
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@dwl:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});