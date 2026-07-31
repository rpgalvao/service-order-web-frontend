import { api } from '../lib/api';

// Tipagem baseada no seu Prisma Schema
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: 'ADMIN' | 'TECHNICIAN';
    avatar_url?: string | null;
}

// Objeto que agrupa todas as chamadas HTTP relacionadas a usuários
export const userService = {

    // Buscar a lista de usuários
    getUsers: async (): Promise<User[]> => {
        // Presumindo que a sua rota de listagem seja GET /users
        const response = await api.get('/user');

        // Como vimos no seu controller, o backend devolve { success: true, data: [...] }
        return response.data.data;
    },

    // Já vamos deixar a estrutura pronta para a criação
    createUser: async (userData: Partial<User>): Promise<User> => {
        const response = await api.post('/user', userData);
        return response.data.data;
    }

};