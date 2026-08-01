import { useState, useEffect, useCallback } from "react";
import {
	Plus,
	Search,
	ClipboardList,
	Wrench,
	Settings,
	ShieldCheck,
	AlertCircle,
} from "lucide-react";
import {
	serviceOrderService,
	type ServiceOrder,
} from "../services/serviceOrderService";
import { NewServiceOrderDrawer } from "../components/ui/NewServiceOrderDrawer";

export function Orders() {
	const [orders, setOrders] = useState<ServiceOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const loadOrders = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await serviceOrderService.getOrders();
			setOrders(data);
		} catch (error) {
			console.error("Erro ao buscar as Ordens de Serviço:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadOrders();
	}, [loadOrders]);

	// Filtro inteligente com trava de segurança (toString)
	const filteredOrders = orders.filter((os) => {
		const term = searchTerm.toLowerCase();
		const osNumber = os.number ? os.number.toString() : "";
		const customerName = os.customer?.name.toLowerCase() || "";
		const serialNumber = os.equipment?.serial_number.toLowerCase() || "";

		return (
			osNumber.includes(term) ||
			customerName.includes(term) ||
			serialNumber.includes(term)
		);
	});

	// Função auxiliar para renderizar o ícone e a cor do tipo de serviço
	const renderTypeIcon = (type: string) => {
		switch (type) {
			case "CORRETIVA":
				return (
					<span title="Corretiva">
						<Wrench className="w-4 h-4 text-red-500" />
					</span>
				);
			case "PREVENTIVA":
				return (
					<span title="Preventiva">
						<ShieldCheck className="w-4 h-4 text-blue-500" />
					</span>
				);
			case "INSTALACAO":
				return (
					<span title="Instalação">
						<Settings className="w-4 h-4 text-emerald-500" />
					</span>
				);
			default:
				return null;
		}
	};

	// Função auxiliar para renderizar o badge de status
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case "ABERTA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
						Aberta
					</span>
				);
			case "FINALIZADA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
						Finalizada
					</span>
				);
			case "CANCELADA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
						Cancelada
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20">
						{status}
					</span>
				);
		}
	};

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
						Ordens de Serviço
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
						Acompanhe e gerencie as manutenções da oficina.
					</p>
				</div>

				<button
					onClick={() => setIsDrawerOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" />
					Nova O.S.
				</button>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				{/* Barra de Pesquisa */}
				<div className="p-4 border-b border-app-border">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dwl-blue/40 dark:text-dwl-grey" />
						<input
							type="text"
							placeholder="Buscar por Nº, Cliente ou S/N..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all"
						/>
					</div>
				</div>

				{/* Tabela de O.S. */}
				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse min-w-[900px]">
						<thead>
							<tr className="border-b border-app-border bg-black/5 dark:bg-white/5 transition-colors">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									O.S.
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Cliente / Equipamento
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Problema Relatado
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Abertura
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-center">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-app-border">
							{isLoading ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										<div className="flex flex-col items-center justify-center">
											<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
											<p>
												Carregando ordens de serviço...
											</p>
										</div>
									</td>
								</tr>
							) : filteredOrders.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										<div className="flex flex-col items-center justify-center gap-2">
											<ClipboardList className="w-8 h-8 opacity-50" />
											<p>
												Nenhuma ordem de serviço
												encontrada.
											</p>
										</div>
									</td>
								</tr>
							) : (
								filteredOrders.map((os) => (
									<tr
										key={os.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												{renderTypeIcon(os.type)}
												<span className="font-bold text-dwl-blue dark:text-dwl-light">
													#
													{String(os.number).padStart(
														4,
														"0",
													)}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div>
												<p className="text-sm font-medium text-dwl-blue dark:text-dwl-light truncate max-w-[200px]">
													{os.customer?.name ||
														"Sem Cliente"}
												</p>
												<p className="text-xs text-dwl-blue/60 dark:text-dwl-grey mt-0.5 truncate max-w-[200px]">
													S/N:{" "}
													{
														os.equipment
															?.serial_number
													}
													{os.equipment?.model?.name
														? ` - ${os.equipment.model.name}`
														: ""}
												</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-start gap-2 max-w-xs">
												<AlertCircle className="w-4 h-4 text-dwl-teal shrink-0 mt-0.5" />
												<p className="text-sm text-dwl-blue/80 dark:text-dwl-light truncate">
													{os.problem_description}
												</p>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey whitespace-nowrap">
											{os.opened_at
												? new Date(
														os.opened_at,
													).toLocaleDateString(
														"pt-BR",
														{
															day: "2-digit",
															month: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)
												: "Data indisponível"}
										</td>
										<td className="px-6 py-4 text-center">
											{renderStatusBadge(os.status)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Gaveta com a inteligência de cascata */}
			<NewServiceOrderDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadOrders}
			/>
		</div>
	);
}
