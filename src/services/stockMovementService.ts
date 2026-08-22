import { api } from '../lib/api';

export interface StockMovement {
    id: string;
    partId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    userId?: string | null;
    serviceOrderId?: string | null;
    created_at: string;
    part?: {
        name: string;
        sku?: string | null;
    };
}

export const stockMovementService = {
    createMovement: async (
        data: { partId: string; type: 'IN' | 'OUT'; quantity: number; reason: string; userId?: string; unit_cost?: number; }
    ): Promise<any> => {
        const response = await api.post('/stock-movements', data);
        return response.data.data;
    },

    getMovements: async (partId?: string): Promise<StockMovement[]> => {
        // Se passar o partId, busca apenas o histórico daquela peça específica
        const response = await api.get(`/stock-movements${partId ? `?partId=${partId}` : ''}`);
        return response.data.data;
    }
};