import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function RecentActivities() {
	const activities = [
		{
			id: 1,
			title: "O.S. #1042 Finalizada",
			description: "Equipamento Analisador Bioquímico entregue.",
			time: "Há 10 min",
			icon: CheckCircle2,
			iconColor: "text-dwl-teal dark:text-dwl-cyan",
			bgColor: "bg-dwl-teal/10 dark:bg-dwl-teal/20",
		},
		{
			id: 2,
			title: "Peça em Falta",
			description: "Placa mãe do modelo X-200 atingiu estoque mínimo.",
			time: "Há 2 horas",
			icon: AlertCircle,
			iconColor: "text-red-500",
			bgColor: "bg-red-500/10 dark:bg-red-500/20",
		},
		{
			id: 3,
			title: "Nova O.S. Aberta (#1043)",
			description: "Microscópio Óptico - Cliente: Lab. São Marcos.",
			time: "Há 3 horas",
			icon: Clock,
			iconColor: "text-dwl-blue dark:text-dwl-light",
			bgColor: "bg-dwl-blue/10 dark:bg-white/10",
		},
	];

	return (
		<div className="bg-app-lightSurface dark:bg-app-darkSurface p-6 rounded-xl border border-app-border shadow-sm h-full transition-colors duration-300">
			<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 transition-colors duration-300">
				Atividades Recentes
			</h3>

			<div className="space-y-4">
				{activities.map((activity) => {
					const Icon = activity.icon;
					return (
						<div
							key={activity.id}
							className="flex items-start gap-4"
						>
							<div
								className={`p-2 rounded-full mt-1 transition-colors duration-300 ${activity.bgColor}`}
							>
								<Icon
									className={`w-4 h-4 ${activity.iconColor}`}
								/>
							</div>
							<div className="flex-1">
								<h4 className="text-sm font-semibold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
									{activity.title}
								</h4>
								<p className="text-xs text-dwl-blue/70 dark:text-dwl-grey mt-0.5 transition-colors duration-300">
									{activity.description}
								</p>
							</div>
							<span className="text-xs font-medium text-dwl-blue/50 dark:text-dwl-grey whitespace-nowrap transition-colors duration-300">
								{activity.time}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
