import { api } from '../lib/api';

export interface Supplier {
    id: string;
    name: string;
    document?: string | null;
    email?: string | null;
    phone?: string | null;
    active: boolean;
    created_at: string;
}

export const supplierService = {
    getSuppliers: async (includeInactive = false): Promise<Supplier[]> => {
        // Busca os fornecedores com base no parâmetro da URL
        const response = await api.get(`/suppliers${includeInactive ? '?all=true' : ''}`);
        return response.data.data;
    },

    getSupplierById: async (id: string): Promise<Supplier> => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data.data;
    },

    createSupplier: async (data: Partial<Supplier>): Promise<Supplier> => {
        const response = await api.post('/suppliers', data);
        return response.data.data;
    },

    updateSupplier: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
        const response = await api.put(`/suppliers/${id}`, data);
        return response.data.data;
    },

    deleteSupplier: async (id: string): Promise<void> => {
        await api.delete(`/suppliers/${id}`);
    }
};