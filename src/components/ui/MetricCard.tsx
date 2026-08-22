import type { ReactNode } from "react";

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: ReactNode;
	trend?: {
		value: string;
		isPositive: boolean;
	};
}

export function MetricCard({ title, value, icon, trend }: MetricCardProps) {
	return (
		<div className="bg-app-lightSurface dark:bg-app-darkSurface p-6 rounded-xl border border-app-border shadow-sm transition-colors duration-300 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-dwl-blue/70 dark:text-dwl-grey">
					{title}
				</h3>
				<div className="p-2 bg-dwl-teal/10 dark:bg-white/5 rounded-lg text-dwl-teal dark:text-dwl-cyan transition-colors duration-300">
					{icon}
				</div>
			</div>

			<div>
				<span className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					{value}
				</span>

				{trend && (
					<div
						className={`text-xs font-medium mt-1 ${trend.isPositive ? "text-dwl-teal" : "text-red-500"}`}
					>
						{trend.isPositive ? "+" : "-"}
						{trend.value} desde o último mês
					</div>
				)}
			</div>
		</div>
	);
}
