import { ClipboardList, AlertCircle, CheckCircle2, Wrench } from "lucide-react";
import { MetricCard } from "../components/ui/MetricCard";
import { OrdersChart } from "../components/ui/OrdersChart";
import { RecentActivities } from "../components/ui/RecentActivities";

export function Dashboard() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					Visão Geral
				</h1>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey transition-colors duration-300 mt-1">
					Acompanhe os principais indicadores da DWL Diagnóstica.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<MetricCard
					title="O.S. em Andamento"
					value="24"
					icon={<Wrench className="w-5 h-5" />}
					trend={{ value: "12%", isPositive: true }}
				/>
				<MetricCard
					title="Aguardando Peças"
					value="8"
					icon={<AlertCircle className="w-5 h-5" />}
					trend={{ value: "3%", isPositive: false }}
				/>
				<MetricCard
					title="O.S. Finalizadas (Mês)"
					value="156"
					icon={<CheckCircle2 className="w-5 h-5" />}
					trend={{ value: "8%", isPositive: true }}
				/>
				<MetricCard
					title="Total de Equipamentos"
					value="1.204"
					icon={<ClipboardList className="w-5 h-5" />}
				/>
			</div>

			{/* Grid Inferior: Gráfico e Atividades Recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="lg:col-span-2">
					<OrdersChart />
				</div>
				<div>
					<RecentActivities />
				</div>
			</div>
		</div>
	);
}
