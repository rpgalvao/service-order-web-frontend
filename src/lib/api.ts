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
        // Se a requisição deu sucesso (200, 201), apenas repassa a resposta para frente
        return response;
    },
    (error) => {
        // Verifica se o erro veio do backend e se é exatamente um 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.warn('Sessão expirada. Redirecionando para o login...');

            // 1. Limpa os dados mortos do navegador (Ajuste as chaves conforme o seu AuthContext)
            localStorage.removeItem('@dwl:token');

            // 2. Força o redirecionamento imediato para a tela inicial (login)
            // Usamos o window.location.href para limpar completamente a árvore de estado do React
            window.location.href = '/';
        }

        // Se for outro erro (ex: 400, 404, 500), repassa para o catch do serviço tratar
        return Promise.reject(error);
    }
);