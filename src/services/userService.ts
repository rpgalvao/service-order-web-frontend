import { api } from '../lib/api';

// Tipagem baseada no seu Prisma Schema
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: 'ADMIN' | 'TECHNICIAN';
    avatar_url?: string | null;
    active?: boolean;
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

    getUsers: async (includeInactive?: boolean): Promise<User[]> => {
        const response = await api.get('/user', { params: { includeInactive } });
        return response.data.data;
    },

    toggleUserStatus: async (id: string): Promise<void> => {
        await api.patch(`/user/${id}/toggle-status`);
    },

    // AJUSTE AQUI: Substitua Partial<User> por CreateUserPayload
    createUser: async (userData: CreateUserPayload): Promise<User> => {
        const response = await api.post('/user', userData);
        return response.data.data;
    },

    updateUserRole: async (id: string, role: 'ADMIN' | 'TECHNICIAN'): Promise<User> => {
        const response = await api.patch(`/user/${id}`, { role });
        return response.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/user/${id}`);
    },

};