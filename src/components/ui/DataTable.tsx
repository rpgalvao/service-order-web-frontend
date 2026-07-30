import { useState } from "react";
import {
	MoreHorizontal,
	Search,
	Filter,
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react";
import { Badge } from "./Badge";
import { NewOrderDrawer } from "./NewOrderDrawer";

const mockOrders = [
	{
		id: "1042",
		client: "Hospital São Luiz",
		equipment: "Analisador Bioquímico",
		date: "30/07/2026",
		status: "Finalizada",
		statusVariant: "success",
	},
	{
		id: "1043",
		client: "Lab. São Marcos",
		equipment: "Microscópio Óptico",
		date: "30/07/2026",
		status: "Em Andamento",
		statusVariant: "info",
	},
	{
		id: "1044",
		client: "Clínica Saúde Mais",
		equipment: "Centrífuga de Bancada",
		date: "29/07/2026",
		status: "Aguardando Peça",
		statusVariant: "warning",
	},
	{
		id: "1045",
		client: "Hospital das Clínicas",
		equipment: "Autoclave",
		date: "28/07/2026",
		status: "Atrasada",
		statusVariant: "danger",
	},
];

export function DataTable() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("Todos");
	const [currentPage, setCurrentPage] = useState(1);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// Limite de itens por página (ajustado para 3 para vermos a paginação em ação)
	const itemsPerPage = 3;

	const filteredOrders = mockOrders.filter((order) => {
		const matchesSearch =
			order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.id.includes(searchTerm);

		const matchesStatus =
			statusFilter === "Todos" || order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Lógica de Paginação
	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	// Extrai apenas os itens da página atual
	const currentOrders = filteredOrders.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	// Funções de navegação
	const handlePreviousPage = () =>
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	const handleNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));

	return (
		<div className="space-y-4">
			{/* Barra de Ferramentas */}
			<div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
				{/* Novo Botão Nova O.S. */}
				<button
					onClick={() => setIsDrawerOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap w-full md:w-auto justify-center"
				>
					<Plus className="w-5 h-5" />
					Nova O.S.
				</button>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1 md:justify-end">
					<div className="relative flex-1 sm:max-w-xs">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
						</div>
						<input
							type="text"
							// Placeholder atualizado para deixar a intenção clara
							placeholder="Filtrar resultados desta lista..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1); // Retorna à primeira página ao buscar
							}}
							className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg bg-app-lightSurface dark:bg-app-darkSurface text-dwl-blue dark:text-dwl-light placeholder-dwl-blue/50 dark:placeholder-dwl-grey focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors duration-300"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Filter className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
						<select
							value={statusFilter}
							onChange={(e) => {
								setStatusFilter(e.target.value);
								setCurrentPage(1); // Retorna à primeira página ao filtrar
							}}
							className="border border-app-border rounded-lg bg-app-lightSurface dark:bg-app-darkSurface text-dwl-blue dark:text-dwl-light py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors duration-300 cursor-pointer appearance-none"
						>
							<option value="Todos">Todos os Status</option>
							<option value="Em Andamento">Em Andamento</option>
							<option value="Aguardando Peça">
								Aguardando Peça
							</option>
							<option value="Finalizada">Finalizada</option>
							<option value="Atrasada">Atrasada</option>
						</select>
					</div>
				</div>
			</div>

			{/* Tabela de Dados */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									O.S.
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Cliente
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Equipamento
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Data Abertura
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Status
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Ações
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-app-border">
							{/* Iterando agora sobre currentOrders ao invés de filteredOrders */}
							{currentOrders.length > 0 ? (
								currentOrders.map((order) => (
									<tr
										key={order.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
									>
										<td className="px-6 py-4 text-sm font-medium text-dwl-teal dark:text-dwl-cyan whitespace-nowrap">
											#{order.id}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue dark:text-dwl-grey whitespace-nowrap">
											{order.client}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue dark:text-dwl-grey whitespace-nowrap">
											{order.equipment}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue dark:text-dwl-grey whitespace-nowrap">
											{order.date}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Badge
												variant={
													order.statusVariant as any
												}
											>
												{order.status}
											</Badge>
										</td>
										<td className="px-6 py-4 text-center whitespace-nowrap">
											<button className="p-1.5 text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
												<MoreHorizontal className="w-5 h-5" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-8 text-center text-sm text-dwl-blue/60 dark:text-dwl-grey"
									>
										Nenhuma Ordem de Serviço encontrada com
										esses filtros.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Rodapé: Controles de Paginação */}
				{filteredOrders.length > 0 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-app-border bg-black/5 dark:bg-white/5 transition-colors duration-300">
						<span className="text-sm text-dwl-blue/70 dark:text-dwl-grey">
							Mostrando{" "}
							<span className="font-semibold text-dwl-blue dark:text-dwl-light">
								{startIndex + 1}
							</span>{" "}
							a{" "}
							<span className="font-semibold text-dwl-blue dark:text-dwl-light">
								{Math.min(
									startIndex + itemsPerPage,
									filteredOrders.length,
								)}
							</span>{" "}
							de{" "}
							<span className="font-semibold text-dwl-blue dark:text-dwl-light">
								{filteredOrders.length}
							</span>{" "}
							registros
						</span>

						<div className="flex items-center gap-2">
							<button
								onClick={handlePreviousPage}
								disabled={currentPage === 1}
								className="p-1.5 rounded-lg text-dwl-blue dark:text-dwl-light hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								title="Página Anterior"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>

							<span className="text-sm font-medium text-dwl-blue dark:text-dwl-light min-w-[4rem] text-center">
								{currentPage} / {totalPages}
							</span>

							<button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className="p-1.5 rounded-lg text-dwl-blue dark:text-dwl-light hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								title="Próxima Página"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Injeção do nosso Painel Lateral */}
			<NewOrderDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			/>
		</div>
	);
}
