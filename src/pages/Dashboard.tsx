import { useState, useEffect } from "react";
import {
	ClipboardList,
	AlertCircle,
	CheckCircle2,
	Wrench,
	AlertTriangle,
} from "lucide-react";
import { MetricCard } from "../components/ui/MetricCard";
import { OrdersChart } from "../components/ui/OrdersChart";
import { RecentActivities } from "../components/ui/RecentActivities";
import { partService, type Part } from "../services/partService";
import {
	dashboardService,
	type DashboardMetrics,
} from "../services/dashboardService"; // <-- NOVO SERVIÇO

export function Dashboard() {
	const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// Dispara as duas buscas ao mesmo tempo para a tela carregar mais rápido (Promise.all)
				const [parts, metricsData] = await Promise.all([
					partService.getLowStockDashboard(),
					dashboardService.getMetrics(),
				]);

				setLowStockParts(parts);
				setMetrics(metricsData);
			} catch (error) {
				console.error("Erro ao carregar dados do dashboard:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					Visão Geral
				</h1>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey transition-colors duration-300 mt-1">
					Acompanhe os principais indicadores do sistema.
				</p>
			</div>

			{/* Banner de Alerta Dinâmico */}
			{!isLoading && lowStockParts.length > 0 && (
				<div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-start gap-4 animate-in fade-in duration-300">
					<div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
						<AlertTriangle className="w-6 h-6" />
					</div>
					<div>
						<h3 className="text-red-800 dark:text-red-300 font-bold">
							Atenção: Reposição de Estoque Necessária
						</h3>
						<p className="text-sm text-red-700 dark:text-red-400 mt-1">
							Você possui {lowStockParts.length}{" "}
							{lowStockParts.length === 1
								? "peça operando"
								: "peças operando"}{" "}
							no limite mínimo ou com saldo zerado.
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{lowStockParts.map((part) => (
								<span
									key={part.id}
									className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-200 dark:border-red-500/30"
								>
									{part.name} (Atual: {part.current_stock} |
									Mín: {part.min_stock})
								</span>
							))}
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* CARDS DINÂMICOS */}
				<MetricCard
					title="O.S. em Andamento"
					value={isLoading ? "..." : metrics?.openOrders || 0}
					icon={<Wrench className="w-5 h-5" />}
				/>

				<MetricCard
					title="Alertas de Estoque"
					value={isLoading ? "..." : lowStockParts.length}
					icon={<AlertCircle className="w-5 h-5" />}
					trend={
						lowStockParts.length > 0
							? { value: "Atenção necessária", isPositive: false }
							: undefined
					}
				/>

				<MetricCard
					title="O.S. Finalizadas (Mês)"
					value={
						isLoading
							? "..."
							: metrics?.finishedOrdersThisMonth || 0
					}
					icon={<CheckCircle2 className="w-5 h-5" />}
				/>

				<MetricCard
					title="Total de Equipamentos"
					value={isLoading ? "..." : metrics?.totalEquipments || 0}
					icon={<ClipboardList className="w-5 h-5" />}
				/>
			</div>

			{/* Grid Inferior: Gráfico e Atividades Recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="lg:col-span-2">
					<OrdersChart data={metrics?.chartData || []} />
				</div>
				<div>
					<RecentActivities
						activities={metrics?.recentActivities || []}
					/>
				</div>
			</div>
		</div>
	);
}
