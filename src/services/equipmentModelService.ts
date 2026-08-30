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

export type UpdateEquipmentModelPayload = Partial<CreateEquipmentModelPayload>;

export const equipmentModelService = {
    getModels: async (includeInactive?: boolean): Promise<EquipmentModel[]> => {
        const response = await api.get('/equipmentmodel', {
            params: { includeInactive } // O Axios transforma isso em ?includeInactive=true
        });
        return response.data.data;
    },

    createModel: async (data: CreateEquipmentModelPayload): Promise<EquipmentModel> => {
        const response = await api.post('/equipmentmodel', data);
        return response.data.data;
    },

    updateModel: async (id: string, data: UpdateEquipmentModelPayload): Promise<EquipmentModel> => {
        const response = await api.put(`/equipmentmodel/${id}`, data);
        return response.data.data;
    },

    toggleStatus: async (id: string): Promise<EquipmentModel> => {
        const response = await api.patch(`/equipmentmodel/${id}/toggle-status`);
        return response.data.data;
    }
};