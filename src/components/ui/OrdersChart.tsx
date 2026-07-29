import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "Jan", abertas: 40, finalizadas: 24 },
	{ name: "Fev", abertas: 30, finalizadas: 35 },
	{ name: "Mar", abertas: 45, finalizadas: 30 },
	{ name: "Abr", abertas: 50, finalizadas: 48 },
	{ name: "Mai", abertas: 35, finalizadas: 40 },
	{ name: "Jun", abertas: 60, finalizadas: 55 },
];

export function OrdersChart() {
	return (
		<div className="bg-app-lightSurface dark:bg-app-darkSurface p-6 rounded-xl border border-app-border shadow-sm h-full transition-colors duration-300 flex flex-col">
			<div className="mb-6">
				<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					Evolução de Ordens de Serviço
				</h3>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey transition-colors duration-300">
					Comparativo de O.S. Abertas vs Finalizadas no semestre.
				</p>
			</div>

			<div className="flex-1 w-full min-h-[250px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#70808F"
							opacity={0.2}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#70808F", fontSize: 12 }}
							dy={10}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#70808F", fontSize: 12 }}
						/>
						<Tooltip
							cursor={{ fill: "#70808F", opacity: 0.1 }}
							contentStyle={{
								backgroundColor: "#225378",
								border: "none",
								borderRadius: "8px",
								color: "#E7FCE7",
							}}
							itemStyle={{ color: "#E7FCE7" }}
						/>
						{/* Barras com as cores oficiais da DWL */}
						<Bar
							dataKey="abertas"
							name="Abertas"
							fill="#ACF0F2"
							radius={[4, 4, 0, 0]}
						/>
						<Bar
							dataKey="finalizadas"
							name="Finalizadas"
							fill="#179680"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
