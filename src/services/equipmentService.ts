import { api } from '../lib/api';

export interface Equipment {
    id: string;
    serial_number: string;
    modelId: string;
    customerId?: string | null;
    status: 'RECEBIDO' | 'EM_ANALISE' | 'REPARO' | 'FINALIZADO' | 'OS_CANCELADA';
    model?: { name: string; };
    customer?: { name: string; };
}

export interface CreateEquipmentPayload {
    serial_number: string;
    modelId: string;
    customerId?: string;
    status?: 'EM_ANALISE' | 'REPARO' | 'FINALIZADO';
}

export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload>;

export const equipmentService = {
    getEquipments: async (params?: { status?: string, customerId?: string; }): Promise<Equipment[]> => {
        const response = await api.get('/equipment', { params });
        return response.data.data;
    },

    createEquipment: async (data: CreateEquipmentPayload): Promise<Equipment> => {
        const response = await api.post('/equipment', data);
        return response.data.data;
    },

    updateEquipment: async (id: string, data: UpdateEquipmentPayload): Promise<Equipment> => {
        const response = await api.put(`/equipment/${id}`, data);
        return response.data.data;
    },

    deleteEquipment: async (id: string): Promise<void> => {
        await api.delete(`/equipment/${id}`);
    }
};