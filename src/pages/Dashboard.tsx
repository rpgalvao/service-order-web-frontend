import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ClipboardList,
	AlertCircle,
	CheckCircle2,
	Wrench,
	AlertTriangle,
	TrendingUp,
	Clock,
} from "lucide-react";
import { MetricCard } from "../components/ui/MetricCard";
import { OrdersChart } from "../components/ui/OrdersChart";
import { RecentActivities } from "../components/ui/RecentActivities";
import { partService, type Part } from "../services/partService";
import {
	dashboardService,
	type DashboardMetrics,
} from "../services/dashboardService";

export function Dashboard() {
	const navigate = useNavigate();
	const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
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
				<div
					onClick={() => navigate("/ordens?status=ABERTA")}
					className="cursor-pointer transition-transform hover:scale-[1.02]"
				>
					<MetricCard
						title="O.S. em Andamento"
						value={isLoading ? "..." : metrics?.openOrders || 0}
						icon={<Wrench className="w-5 h-5" />}
					/>
				</div>

				<div
					onClick={() => navigate("/estoque")}
					className="cursor-pointer transition-transform hover:scale-[1.02]"
				>
					<MetricCard
						title="Alertas de Estoque"
						value={isLoading ? "..." : lowStockParts.length}
						icon={<AlertCircle className="w-5 h-5" />}
						trend={
							lowStockParts.length > 0
								? {
										value: "Atenção necessária",
										isPositive: false,
									}
								: undefined
						}
					/>
				</div>

				<div
					onClick={() => navigate("/ordens?status=FINALIZADA")}
					className="cursor-pointer transition-transform hover:scale-[1.02]"
				>
					<MetricCard
						title="O.S. Finalizadas (Mês)"
						value={
							isLoading
								? "..."
								: metrics?.finishedOrdersThisMonth || 0
						}
						icon={<CheckCircle2 className="w-5 h-5" />}
					/>
				</div>

				<div
					onClick={() => navigate("/equipamentos")}
					className="cursor-pointer transition-transform hover:scale-[1.02]"
				>
					<MetricCard
						title="Total de Equipamentos"
						value={
							isLoading ? "..." : metrics?.totalEquipments || 0
						}
						icon={<ClipboardList className="w-5 h-5" />}
					/>
				</div>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface border border-app-border rounded-xl p-6 shadow-sm">
				<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4">
					Performance da Equipe Técnica
				</h2>
				{isLoading ? (
					<div className="animate-pulse space-y-4">
						<div className="h-10 bg-black/5 dark:bg-white/5 rounded-lg w-full"></div>
						<div className="h-10 bg-black/5 dark:bg-white/5 rounded-lg w-full"></div>
					</div>
				) : !metrics?.techMetrics ||
				  metrics.techMetrics.length === 0 ? (
					<p className="text-sm text-dwl-blue/50 dark:text-dwl-grey text-center py-6">
						Nenhum dado de técnico disponível ainda.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-bold text-dwl-blue/70 dark:text-dwl-grey uppercase mb-2">
								<TrendingUp className="w-4 h-4" /> Volume de
								O.S. Resolvidas
							</div>
							{metrics.techMetrics.map((tech) => (
								<div
									key={`vol-${tech.name}`}
									onClick={() =>
										navigate(
											`/ordens?status=FINALIZADA&tech=${encodeURIComponent(tech.name)}`,
										)
									}
									className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-app-border cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
								>
									<span className="font-medium text-sm">
										{tech.name}
									</span>
									<span className="text-dwl-teal font-bold bg-dwl-teal/10 px-3 py-1 rounded-full text-xs">
										{tech.osCount} O.S.
									</span>
								</div>
							))}
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-bold text-dwl-blue/70 dark:text-dwl-grey uppercase mb-2">
								<Clock className="w-4 h-4" /> Tempo Médio de
								Resolução
							</div>
							{metrics.techMetrics.map((tech) => (
								<div
									key={`time-${tech.name}`}
									onClick={() =>
										navigate(
											`/ordens?status=FINALIZADA&tech=${encodeURIComponent(tech.name)}`,
										)
									}
									className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-app-border cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
								>
									<span className="font-medium text-sm">
										{tech.name}
									</span>
									<span
										className={`font-bold px-3 py-1 rounded-full text-xs ${tech.avgResolutionTimeHours <= 48 ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}
									>
										{tech.avgResolutionTimeHours} Horas
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
