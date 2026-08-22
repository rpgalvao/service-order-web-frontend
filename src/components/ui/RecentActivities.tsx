import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { RecentActivity } from "../../services/dashboardService";

interface RecentActivitiesProps {
	activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
	// Função utilitária para transformar a data em "Há X minutos"
	const timeAgo = (dateString: string) => {
		const seconds = Math.floor(
			(new Date().getTime() - new Date(dateString).getTime()) / 1000,
		);
		let interval = seconds / 31536000;
		if (interval > 1) return `Há ${Math.floor(interval)} anos`;
		interval = seconds / 2592000;
		if (interval > 1) return `Há ${Math.floor(interval)} meses`;
		interval = seconds / 86400;
		if (interval > 1) return `Há ${Math.floor(interval)} dias`;
		interval = seconds / 3600;
		if (interval > 1) return `Há ${Math.floor(interval)} horas`;
		interval = seconds / 60;
		if (interval > 1) return `Há ${Math.floor(interval)} min`;
		return "Agora mesmo";
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "FINALIZADA":
				return {
					icon: CheckCircle2,
					title: "O.S. Finalizada",
					color: "text-dwl-teal dark:text-dwl-cyan",
					bg: "bg-dwl-teal/10 dark:bg-dwl-teal/20",
				};
			case "CANCELADA":
				return {
					icon: AlertCircle,
					title: "O.S. Cancelada",
					color: "text-red-500",
					bg: "bg-red-500/10 dark:bg-red-500/20",
				};
			default:
				return {
					icon: Clock,
					title: "O.S. Atualizada",
					color: "text-dwl-blue dark:text-dwl-light",
					bg: "bg-dwl-blue/10 dark:bg-white/10",
				};
		}
	};

	return (
		<div className="bg-app-lightSurface dark:bg-app-darkSurface p-6 rounded-xl border border-app-border shadow-sm h-full transition-colors duration-300">
			<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 transition-colors duration-300">
				Atividades Recentes
			</h3>

			<div className="space-y-4">
				{activities.length === 0 ? (
					<p className="text-sm text-dwl-blue/50 dark:text-dwl-grey text-center py-4">
						Nenhuma atividade recente.
					</p>
				) : (
					activities.map((activity) => {
						const config = getStatusConfig(activity.status);
						const Icon = config.icon;
						return (
							<div
								key={activity.id}
								className="flex items-start gap-4"
							>
								<div
									className={`p-2 rounded-full mt-1 transition-colors duration-300 ${config.bg}`}
								>
									<Icon
										className={`w-4 h-4 ${config.color}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-semibold text-dwl-blue dark:text-dwl-light transition-colors duration-300 truncate">
										{config.title} (#{activity.number})
									</h4>
									<p className="text-xs text-dwl-blue/70 dark:text-dwl-grey mt-0.5 transition-colors duration-300 truncate">
										{activity.equipment?.model.name ||
											"Equipamento"}{" "}
										- {activity.customer.name}
									</p>
								</div>
								<span className="text-xs font-medium text-dwl-blue/50 dark:text-dwl-grey whitespace-nowrap transition-colors duration-300">
									{timeAgo(activity.updated_at)}
								</span>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
