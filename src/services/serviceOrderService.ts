import { api } from '../lib/api';

// O que vamos enviar para o backend (Baseado no seu openServiceOrderSchema)
export interface CreateServiceOrderPayload {
    customerId: string;
    equipmentId: string;
    type: 'INSTALACAO' | 'PREVENTIVA' | 'CORRETIVA';
    problem_description: string;
    solution_description?: string;
    client_signature?: string;
}

export interface ChecklistAnswer {
    id: string;
    question_text: string;
    order: number;
    is_ok: boolean;
    comment?: string | null;
}

export interface ServiceOrderChecklist {
    id: string;
    notes?: string | null;
    started_at: string;
    completed_at?: string | null;
    answers: ChecklistAnswer[];
}

// Estrutura básica do retorno do Prisma para listagem
export interface ServiceOrder {
    id: string;
    number: number; // Número sequencial da O.S.
    type: 'INSTALACAO' | 'PREVENTIVA' | 'CORRETIVA';
    status: 'ABERTA' | 'FINALIZADA' | 'CANCELADA';
    problem_description: string;
    opened_at: string;

    // Fechamento e/ou cancelamento da O.S.
    closed_at?: string | null;
    cancellation_reason?: string | null;
    solution_description?: string | null;
    technical_notes?: string;
    client_signature?: string;
    signer_name?: string;

    // Relacionamentos que o Prisma geralmente traz com o "include"
    customer?: { name: string; phone?: string | null; email: string | null; };
    equipment?: { serial_number: string; model?: { name: string; }; };
    openedBy?: { name: string; };
    closedBy?: { name: string; };
    checklist?: ServiceOrderChecklist | null;

    // Eventos de reabertura de O.S.
    events?: { id: string; action: string; notes?: string | null; created_at: string; user?: { name: string; }; }[];

    // Peças substituídas na execução do serviço
    parts_replaced?: {
        id: string;
        quantity: number;
        unit_price: string | number;
        part: {
            name: string;
            sku?: string | null;
        };
    }[];
}

export const serviceOrderService = {

    getOrders: async (): Promise<ServiceOrder[]> => {
        // Verifique se no seu backend a rota foi registrada como /service-orders ou /service-order
        const response = await api.get('/serviceorder');
        return response.data.data;
    },

    createOrder: async (data: CreateServiceOrderPayload): Promise<ServiceOrder> => {
        const response = await api.post('/serviceorder', data);
        return response.data.data;
    },

    // Já deixamos as chamadas de ciclo de vida mapeadas para o futuro
    cancelOrder: async (id: string, reason: string): Promise<void> => {
        await api.patch(`/serviceorder/${id}/cancel`, { reason });
    },

    reopenOrder: async (id: string): Promise<void> => {
        await api.patch(`/serviceorder/${id}/reopen`);
    },

    getOrderById: async (id: string): Promise<ServiceOrder> => {
        const response = await api.get(`/serviceorder/${id}`);
        return response.data.data;
    },

    updateOrder: async (id: string, data: {
        status?: string;
        solution_description?: string;
        technical_notes?: string;
        client_signature?: string;
        signer_name?: string;
    }): Promise<ServiceOrder> => {
        const response = await api.put(`/serviceorder/${id}`, data);
        return response.data.data;
    },

    updateChecklist: async (
        id: string,
        data: { notes?: string; answers: { id: string; is_ok: boolean; comment?: string; }[]; }
    ): Promise<void> => {
        await api.patch(`/serviceorder/${id}/checklist`, data);
    },

    addPart: async (osId: string, partId: string, quantity: number): Promise<void> => {
        await api.post(`/serviceorder/${osId}/parts`, { partId, quantity });
    },

    exportPdf: async (id: string): Promise<string> => {
        const response = await api.get(`/serviceorder/${id}/export/pdf`);
        // Retorna exatamente a URL que o seu backend gerou
        return response.data.data.pdf_url;
    },

    // Adicione essa função junto com as outras no objeto do serviceOrderService
    saveClientSignature: async (id: string, signatureBase64: string) => {
        const response = await api.patch(`/serviceorder/${id}/signature`, { signatureBase64 });
        return response.data;
    },

    sendEmail: async (id: string, customEmail?: string): Promise<{ message: string; sent_to: string; }> => {
        const response = await api.post(`/serviceorder/${id}/send-email`, { customEmail });
        return response.data.data;
    }
};