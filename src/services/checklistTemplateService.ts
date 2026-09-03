import { api } from '../lib/api';

export interface ChecklistQuestion {
    id: string;
    text: string;
    order: number;
}

export interface ChecklistTemplate {
    id: string;
    name: string;
    active: boolean;
    modelId: string;
    created_at: string;

    // Relacionamentos (O Prisma geralmente traz no include)
    model?: { name: string; };
    questions?: ChecklistQuestion[];
}

export const checklistTemplateService = {

    getTemplates: async (includeInactive?: boolean): Promise<ChecklistTemplate[]> => {
        const response = await api.get('/checklist-templates', { params: { includeInactive } });
        return response.data.data;
    },

    getTemplateById: async (id: string): Promise<ChecklistTemplate> => {
        const response = await api.get(`/checklist-templates/${id}`);
        return response.data.data;
    },

    createTemplate: async (data: { name: string; modelId: string; }): Promise<ChecklistTemplate> => {
        const response = await api.post('/checklist-templates', data);
        return response.data.data;
    },

    toggleStatus: async (id: string): Promise<ChecklistTemplate> => {
        const response = await api.patch(`/checklist-templates/${id}/toggle-status`);
        return response.data.data;
    },

    addQuestion: async (templateId: string, data: { text: string; order: number; }): Promise<ChecklistQuestion> => {
        const response = await api.post(`/checklist-templates/${templateId}/questions`, data);
        return response.data.data;
    },

    deleteQuestion: async (questionId: string): Promise<void> => {
        // Verifique como ficou a string da rota de delete no seu checklistTemplate.routes.ts
        // Baseado no seu controller, enviaremos apenas o questionId
        await api.delete(`/checklist-templates/questions/${questionId}`);
    },

    updateTemplate: async (id: string, data: { name?: string; modelId?: string; }): Promise<ChecklistTemplate> => {
        const response = await api.put(`/checklist-templates/${id}`, data);
        return response.data.data;
    },

    updateQuestion: async (questionId: string, data: { text?: string; order?: number; }): Promise<ChecklistQuestion> => {
        const response = await api.put(`/checklist-templates/questions/${questionId}`, data);
        return response.data.data;
    }
};