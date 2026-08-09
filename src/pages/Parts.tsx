import { useState, useEffect, useCallback } from "react";
import {
	Plus,
	Search,
	Edit2,
	Trash2,
	AlertTriangle,
	ArrowDownToLine,
} from "lucide-react";
import { partService, type Part } from "../services/partService";
import { PartDrawer } from "../components/ui/PartDrawer";
import { formatCurrency } from "../utils/formatters";
import { StockEntryDrawer } from "../components/ui/StockEntryDrawer";

export function Parts() {
	const [parts, setParts] = useState<Part[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [includeInactive, setIncludeInactive] = useState(false);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [partToEdit, setPartToEdit] = useState<Part | null>(null);

	const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
	const [selectedPartForEntry, setSelectedPartForEntry] = useState<
		string | null
	>(null);

	const loadParts = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await partService.getParts(includeInactive);
			setParts(data);
		} catch (error) {
			console.error("Erro ao buscar peças:", error);
		} finally {
			setIsLoading(false);
		}
	}, [includeInactive]);

	useEffect(() => {
		loadParts();
	}, [loadParts]);

	const handleOpenCreate = () => {
		setPartToEdit(null);
		setIsDrawerOpen(true);
	};

	const handleOpenEdit = (part: Part) => {
		setPartToEdit(part);
		setIsDrawerOpen(true);
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Deseja realmente inativar a peça "${name}"?`)) return;
		try {
			await partService.deletePart(id);
			loadParts();
		} catch (err) {
			alert("Erro ao inativar a peça.");
		}
	};

	const filteredParts = parts.filter(
		(p) =>
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())),
	);

	return (
		// CORREÇÃO 1: Adicionado flex, flex-col e h-full para a página ocupar 100% da altura da aba
		<div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 w-full min-w-0">
			{/* CORREÇÃO 2: flex-none garante que o cabeçalho nunca seja espremido */}
			<div className="flex-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="w-full max-w-md relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
					</div>
					<input
						type="text"
						placeholder="Buscar por nome ou SKU..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg bg-app-lightSurface dark:bg-app-darkSurface text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
					/>
				</div>

				<div className="flex items-center gap-4 w-full sm:w-auto">
					<label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-dwl-blue dark:text-dwl-light">
						<input
							type="checkbox"
							checked={includeInactive}
							onChange={(e) =>
								setIncludeInactive(e.target.checked)
							}
							className="rounded border-app-border text-dwl-teal focus:ring-dwl-teal bg-transparent"
						/>
						Exibir inativas
					</label>
					<button
						onClick={handleOpenCreate}
						className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex-1 sm:flex-none justify-center"
					>
						<Plus className="w-5 h-5" /> Nova Peça
					</button>
					<button
						onClick={() => {
							setSelectedPartForEntry(null);
							setIsEntryDrawerOpen(true);
						}}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex-1 sm:flex-none justify-center"
					>
						<ArrowDownToLine className="w-5 h-5" /> Registrar Compra
					</button>
				</div>
			</div>

			{/* CORREÇÃO 3: flex-1 e min-h-0 dizem para esta caixa preencher o espaço restante, mas sem empurrar o cabeçalho para fora */}
			<div className="flex-1 min-h-0 bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm w-full flex flex-col">
				{/* CORREÇÃO 4: overflow-auto colocado apenas na div que abraça a tabela */}
				<div className="flex-1 overflow-auto w-full">
					<table className="w-full text-left border-collapse min-w-[900px]">
						<thead>
							<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Produto
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Valores
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Estoque
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Fornecedor
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-right sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Ações
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
										Carregando...
									</td>
								</tr>
							) : filteredParts.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										Nenhuma peça encontrada no catálogo.
									</td>
								</tr>
							) : (
								filteredParts.map((part) => (
									<tr
										key={part.id}
										className={`transition-colors ${!part.active ? "opacity-50" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
									>
										<td className="px-6 py-4">
											<div className="font-medium text-sm text-dwl-blue dark:text-dwl-light">
												{part.name}
											</div>
											<div className="text-xs text-dwl-blue/70 dark:text-dwl-grey mt-0.5">
												SKU: {part.sku || "N/A"}
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue dark:text-dwl-light">
											{/* APLICAÇÃO DO FORMATADOR DE MOEDA AQUI */}
											<div>
												Custo:{" "}
												{formatCurrency(
													part.cost_price,
												)}
											</div>
											<div className="font-medium text-dwl-teal">
												Venda:{" "}
												{formatCurrency(
													part.sale_price,
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<span
													className={`text-sm font-bold ${part.current_stock <= part.min_stock ? "text-red-500" : "text-dwl-blue dark:text-dwl-light"}`}
												>
													{part.current_stock} un
												</span>
												{part.current_stock <=
													part.min_stock && (
													<span
														title="Estoque Mínimo Atingido!"
														className="flex items-center"
													>
														<AlertTriangle className="w-4 h-4 text-red-500" />
													</span>
												)}
											</div>
											<div className="text-xs text-dwl-blue/70 dark:text-dwl-grey mt-0.5">
												Mínimo: {part.min_stock}
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey">
											{part.supplier?.name || "-"}
										</td>
										<td className="px-6 py-4 text-right whitespace-nowrap">
											<button
												onClick={() =>
													handleOpenEdit(part)
												}
												className="p-2 text-dwl-blue/60 hover:text-dwl-teal dark:text-dwl-grey dark:hover:text-dwl-teal transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 mr-1"
												title="Editar"
											>
												<Edit2 className="w-4 h-4" />
											</button>
											{part.active && (
												<button
													onClick={() =>
														handleDelete(
															part.id,
															part.name,
														)
													}
													className="p-2 text-dwl-blue/60 hover:text-red-500 dark:text-dwl-grey dark:hover:text-red-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
													title="Inativar"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<PartDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadParts}
				partToEdit={partToEdit}
			/>

			<StockEntryDrawer
				isOpen={isEntryDrawerOpen}
				onClose={() => setIsEntryDrawerOpen(false)}
				onSuccess={loadParts} // Recarrega a tabela automaticamente!
				preSelectedPartId={selectedPartForEntry}
			/>
		</div>
	);
}
