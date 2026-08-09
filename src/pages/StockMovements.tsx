import { useState, useEffect, useCallback } from "react";
import {
	Search,
	ArrowDownToLine,
	ArrowUpFromLine,
	History,
} from "lucide-react";
import {
	stockMovementService,
	type StockMovement,
} from "../services/stockMovementService";

export function StockMovements() {
	const [movements, setMovements] = useState<StockMovement[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const loadMovements = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await stockMovementService.getMovements();
			setMovements(data);
		} catch (error) {
			console.error("Erro ao buscar histórico de movimentações:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadMovements();
	}, [loadMovements]);

	// Filtra pelo nome da peça ou pelo motivo/documento
	const filteredMovements = movements.filter(
		(m) =>
			m.part?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			m.reason.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Função simples para formatar a data e hora no padrão brasileiro
	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 w-full min-w-0">
			<div className="flex-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="w-full max-w-md relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
					</div>
					<input
						type="text"
						placeholder="Buscar por peça ou motivo..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg bg-app-lightSurface dark:bg-app-darkSurface text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
					/>
				</div>

				<div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light rounded-lg text-sm font-medium">
					<History className="w-4 h-4 text-dwl-teal" />
					Log de Auditoria
				</div>
			</div>

			<div className="flex-1 min-h-0 bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm w-full flex flex-col">
				<div className="flex-1 overflow-auto w-full">
					<table className="w-full text-left border-collapse min-w-[900px]">
						<thead>
							<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Data e Hora
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)] text-center">
									Tipo
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Peça
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)] text-center">
									Quantidade
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light sticky top-0 bg-app-lightSurface dark:bg-app-darkSurface z-10 shadow-[0_1px_0_var(--app-border)]">
									Motivo / Documento
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
										Carregando histórico...
									</td>
								</tr>
							) : filteredMovements.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										Nenhum registro de movimentação
										encontrado.
									</td>
								</tr>
							) : (
								filteredMovements.map((movement) => (
									<tr
										key={movement.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
									>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-light whitespace-nowrap">
											{formatDateTime(
												movement.created_at,
											)}
										</td>
										<td className="px-6 py-4 text-center">
											{movement.type === "IN" ? (
												<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
													<ArrowDownToLine className="w-3 h-3" />{" "}
													ENTRADA
												</span>
											) : (
												<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
													<ArrowUpFromLine className="w-3 h-3" />{" "}
													SAÍDA
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											<div className="font-medium text-sm text-dwl-blue dark:text-dwl-light">
												{movement.part?.name ||
													"Peça Excluída"}
											</div>
											<div className="text-xs text-dwl-blue/70 dark:text-dwl-grey mt-0.5">
												SKU:{" "}
												{movement.part?.sku || "N/A"}
											</div>
										</td>
										<td className="px-6 py-4 text-center font-bold text-sm text-dwl-blue dark:text-dwl-light">
											{movement.type === "IN" ? "+" : "-"}
											{movement.quantity}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey">
											{movement.reason}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
