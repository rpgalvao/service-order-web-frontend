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

// NOVA TIPAGEM: Exclusiva para o envio dos dados de criação
export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

// Objeto que agrupa todas as chamadas HTTP relacionadas a usuários
export const userService = {

    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/user');
        return response.data.data;
    },

    // AJUSTE AQUI: Substitua Partial<User> por CreateUserPayload
    createUser: async (userData: CreateUserPayload): Promise<User> => {
        const response = await api.post('/user', userData);
        return response.data.data;
    }

};