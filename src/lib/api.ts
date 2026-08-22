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

// 🛡️ Interceptor de Resposta (A nossa trava de segurança para o 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Pega a URL original da requisição que deu erro
        const originalRequestUrl = error.config?.url || '';

        // Se o erro for 401, MAS a rota for de login ou auth, apenas repassa o erro para o componente mostrar a mensagem
        if (error.response && error.response.status === 401) {
            if (originalRequestUrl.includes('/login') || originalRequestUrl.includes('/auth/')) {
                return Promise.reject(error);
            }

            // Se for 401 em qualquer outra rota protegida, aí sim desloga o usuário
            console.warn('Sessão expirada. Redirecionando para o login...');
            localStorage.removeItem('@dwl:token');
            window.location.href = '/login'; // Ajustado direto para o /login para evitar duplos redirecionamentos
        }

        return Promise.reject(error);
    }
);