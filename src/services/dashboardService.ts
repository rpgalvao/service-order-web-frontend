import { api } from '../lib/api';

export interface ChartData {
    name: string;
    abertas: number;
    finalizadas: number;
}

export interface RecentActivity {
    id: string;
    number: number;
    status: 'ABERTA' | 'FINALIZADA' | 'CANCELADA';
    updated_at: string;
    equipment?: { model: { name: string; }; };
    customer: { name: string; };
}

export interface DashboardMetrics {
    openOrders: number;
    completedOS: number;
    finishedOrdersThisMonth: number;
    totalEquipments: number;
    chartData: ChartData[];
    recentActivities: RecentActivity[];
}

export const dashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        const response = await api.get('/dashboard/metrics');
        return response.data.data;
    }
};