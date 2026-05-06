import axios from 'axios';

// 1. Criamos a nossa central apontando para o backend (Nuvem ou Local)
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
});

// 2. O Interceptor: O nosso pedágio de saída
api.interceptors.request.use(
    (config) => {
        // Pega o token salvo no cofre do navegador
        const token = localStorage.getItem('@dwl:token');

        // Se o token existir, "grampeia" ele no cabeçalho de Autorização
        // Usamos o padrão 'Bearer ' (Portador) que o nosso backend exige
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Libera a requisição para seguir viagem para o backend
        return config;
    },
    (error) => {
        // Se der algum erro na configuração antes de enviar, repassa o erro
        return Promise.reject(error);
    }
);