import { api } from '../lib/api';

// Baseado no retorno que esperamos do Prisma (com os joins para exibir o nome do cliente e modelo)
export interface Equipment {
    id: string;
    serial_number: string;
    modelId: string;
    customerId?: string | null;
    status: 'RECEBIDO' | 'EM_ANALISE' | 'REPARO' | 'FINALIZADO' | 'OS_CANCELADA';

    // O Prisma geralmente devolve os objetos aninhados quando fazemos o "include"
    model?: { name: string; };
    customer?: { name: string; };
}

export interface CreateEquipmentPayload {
    serial_number: string;
    modelId: string;
    customerId?: string;
    status?: 'EM_ANALISE' | 'REPARO' | 'FINALIZADO';
}

export const equipmentService = {

    // A rota de listagem aceita query params opcionais (status e customerId)
    getEquipments: async (params?: { status?: string, customerId?: string; }): Promise<Equipment[]> => {
        const response = await api.get('/equipment', { params });
        return response.data.data;
    },

    createEquipment: async (data: CreateEquipmentPayload): Promise<Equipment> => {
        const response = await api.post('/equipment', data);
        return response.data.data;
    },

    deleteEquipment: async (id: string): Promise<void> => {
        await api.delete(`/equipment/${id}`);
    }

};