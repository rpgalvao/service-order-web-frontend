import { api } from '../lib/api';

export interface EquipmentModel {
    id: string;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateEquipmentModelPayload {
    name: string;
}

export const equipmentModelService = {
    // Ajuste o prefixo da rota conforme você registrou no seu app.ts principal (ex: '/equipment-models' ou '/equipment-model')
    getModels: async (): Promise<EquipmentModel[]> => {
        const response = await api.get('/equipmentmodel');
        return response.data.data;
    },

    createModel: async (data: CreateEquipmentModelPayload): Promise<EquipmentModel> => {
        const response = await api.post('/equipmentmodel', data);
        return response.data.data;
    },

    toggleStatus: async (id: string): Promise<EquipmentModel> => {
        const response = await api.patch(`/equipmentmodel/${id}/toggle-status`);
        return response.data.data;
    }
};