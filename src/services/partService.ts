import { api } from '../lib/api';
import type { Supplier } from './supplierService';

export interface Part {
    id: string;
    name: string;
    sku?: string | null;
    cost_price: number | string;
    sale_price: number | string;
    current_stock: number;
    min_stock: number;
    supplierId?: string | null;
    active: boolean;
    created_at: string;
    supplier?: Supplier | null;
}

export const partService = {
    getParts: async (includeInactive = false): Promise<Part[]> => {
        const response = await api.get(`/parts${includeInactive ? '?all=true' : ''}`);
        return response.data.data;
    },

    getPartById: async (id: string): Promise<Part> => {
        const response = await api.get(`/parts/${id}`);
        return response.data.data;
    },

    createPart: async (data: Partial<Part>): Promise<Part> => {
        const response = await api.post('/parts', data);
        return response.data.data;
    },

    updatePart: async (id: string, data: Partial<Part>): Promise<Part> => {
        const response = await api.put(`/parts/${id}`, data);
        return response.data.data;
    },

    deletePart: async (id: string): Promise<void> => {
        await api.delete(`/parts/${id}`);
    },

    getLowStockDashboard: async (): Promise<Part[]> => {
        const response = await api.get('/parts/dashboard/low-stock');
        return response.data.data;
    }
};