import { api } from '../lib/api'; // Ajuste o caminho se a sua instância do axios estiver em outro lugar

// 1. O que recebemos do backend (Baseado no seu schema.prisma)
export interface Customer {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    zip_code?: string | null;
    city: string;
    state: string;
    address?: string | null;
    active: boolean;
    created_at: string;
}

// 2. O que enviamos para o backend (Baseado no seu customer.validator.ts)
export interface CreateCustomerPayload {
    name: string;
    city: string;
    state: string;
    email?: string;
    zipcode?: string; // Atenção aqui: o seu Zod espera "zipcode" sem underline
    address?: string;
    phone?: string;
}

export const customerService = {

    getCustomers: async (): Promise<Customer[]> => {
        // Assumindo que a sua rota base no express esteja montada como /customer ou /customers
        const response = await api.get('/customer');
        return response.data.data;
    },

    createCustomer: async (customerData: CreateCustomerPayload): Promise<Customer> => {
        const response = await api.post('/customer', customerData);
        return response.data.data;
    },

    // Já deixamos as outras rotas preparadas para o futuro
    deleteCustomer: async (id: string): Promise<void> => {
        await api.delete(`/customer/${id}`);
    }

};