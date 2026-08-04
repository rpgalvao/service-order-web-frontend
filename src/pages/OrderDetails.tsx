import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ClipboardList,
	CheckSquare,
	Wrench,
	AlertCircle,
	RefreshCw,
} from "lucide-react";
import {
	serviceOrderService,
	type ServiceOrder,
} from "../services/serviceOrderService";
import { CancelOrderModal } from "../components/ui/CancelOrderModal";
import { FinishOrderModal } from "../components/ui/FinishOrderModal";

type TabType = "VISAO_GERAL" | "CHECKLIST" | "PECAS";

export function OrderDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [order, setOrder] = useState<ServiceOrder | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState<TabType>("VISAO_GERAL");

	// Estados dos Modais
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

	const loadOrderDetails = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await serviceOrderService.getOrderById(id);
			setOrder(data);
		} catch (err: any) {
			console.error("Erro ao buscar detalhes:", err);
			setError("Não foi possível carregar as informações.");
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadOrderDetails();
	}, [loadOrderDetails]);

	// --- Funções do Ciclo de Vida da O.S. ---

	const handleCancelOrder = async (reason: string) => {
		if (!id) return;
		try {
			await serviceOrderService.cancelOrder(id, reason);
			setIsCancelModalOpen(false);
			loadOrderDetails(); // Recarrega para atualizar o status e a tela
		} catch (err) {
			alert("Erro ao cancelar a O.S.");
		}
	};

	const handleFinishOrder = async (solution: string) => {
		if (!id) return;
		try {
			await serviceOrderService.updateOrder(id, {
				status: "FINALIZADA",
				solution_description: solution,
			});
			setIsFinishModalOpen(false);
			loadOrderDetails();
		} catch (err) {
			alert("Erro ao finalizar a O.S.");
		}
	};

	const handleReopenOrder = async () => {
		if (!id) return;
		if (!confirm("Deseja realmente reabrir esta Ordem de Serviço?")) return;

		try {
			await serviceOrderService.reopenOrder(id);
			loadOrderDetails();
		} catch (err) {
			alert("Erro ao reabrir a O.S.");
		}
	};

	// ----------------------------------------

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-dwl-blue/50 dark:text-dwl-grey">
				<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
				<p>Carregando painel da O.S...</p>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-red-500 gap-4">
				<AlertCircle className="w-12 h-12" />
				<p>{error || "Ordem de Serviço não encontrada."}</p>
				<button
					onClick={() => navigate("/ordens")}
					className="text-dwl-teal underline"
				>
					Voltar para a lista
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			{/* Cabeçalho */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/ordens")}
						className="p-2 bg-app-lightSurface dark:bg-app-darkSurface border border-app-border rounded-lg text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
								O.S. #{String(order.number).padStart(4, "0")}
							</h1>
							<span
								className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
									order.status === "ABERTA"
										? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
										: order.status === "FINALIZADA"
											? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
											: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
								}`}
							>
								{order.status}
							</span>
						</div>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
							{order.customer?.name || "Estoque Interno"} • S/N:{" "}
							{order.equipment?.serial_number}
						</p>
					</div>
				</div>

				{/* Botões Dinâmicos do Ciclo de Vida */}
				<div className="flex gap-2">
					{order.status === "ABERTA" && (
						<>
							<button
								onClick={() => setIsCancelModalOpen(true)}
								className="px-4 py-2 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={() => setIsFinishModalOpen(true)}
								className="px-4 py-2 bg-dwl-teal text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 transition-colors shadow-sm"
							>
								Finalizar O.S.
							</button>
						</>
					)}

					{(order.status === "FINALIZADA" ||
						order.status === "CANCELADA") && (
						<button
							onClick={handleReopenOrder}
							className="flex items-center gap-2 px-4 py-2 border border-app-border bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light rounded-lg text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
						>
							<RefreshCw className="w-4 h-4" />
							Reabrir O.S.
						</button>
					)}
				</div>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				{/* Navegação */}
				<div className="flex border-b border-app-border bg-black/5 dark:bg-white/5">
					<button
						onClick={() => setActiveTab("VISAO_GERAL")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "VISAO_GERAL" ? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface" : "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"}`}
					>
						<ClipboardList className="w-4 h-4" /> Visão Geral
					</button>
					<button
						onClick={() => setActiveTab("CHECKLIST")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "CHECKLIST" ? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface" : "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"}`}
					>
						<CheckSquare className="w-4 h-4" /> Checklist
					</button>
					<button
						onClick={() => setActiveTab("PECAS")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "PECAS" ? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface" : "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"}`}
					>
						<Wrench className="w-4 h-4" /> Peças Utilizadas
					</button>
				</div>

				{/* Conteúdo Aba */}
				<div className="flex-1 overflow-auto p-6">
					{activeTab === "VISAO_GERAL" && (
						<div className="space-y-6 text-dwl-blue dark:text-dwl-light animate-in fade-in">
							{/* Grid de Informações Básicas e Datas */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Dados do Equipamento */}
								<div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border">
									<h3 className="text-xs font-bold text-dwl-teal mb-4 uppercase tracking-wider">
										Dados do Equipamento
									</h3>
									<div className="space-y-2 text-sm">
										<p>
											<span className="opacity-70">
												Número de Série:
											</span>{" "}
											<span className="font-medium float-right">
												{order.equipment?.serial_number}
											</span>
										</p>
										<p>
											<span className="opacity-70">
												Modelo Base:
											</span>{" "}
											<span className="font-medium float-right">
												{order.equipment?.model?.name ||
													"N/A"}
											</span>
										</p>
										<p>
											<span className="opacity-70">
												Natureza do Serviço:
											</span>{" "}
											<span className="font-medium float-right">
												{order.type}
											</span>
										</p>
									</div>
								</div>

								{/* Histórico de Datas Enriquecido */}
								<div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border">
									<h3 className="text-xs font-bold text-dwl-teal mb-4 uppercase tracking-wider">
										Histórico de Datas
									</h3>
									<div className="space-y-2 text-sm">
										<p>
											<span className="opacity-70">
												Abertura:
											</span>{" "}
											<span className="font-medium float-right">
												{new Date(
													order.opened_at,
												).toLocaleString("pt-BR")}
											</span>
										</p>
										<p>
											<span className="opacity-70">
												Aberto Por:
											</span>{" "}
											<span className="font-medium float-right">
												{order.openedBy?.name ||
													"Sistema"}
											</span>
										</p>

										{/* Exibe o encerramento apenas se existir a data de fechamento */}
										{order.closed_at && (
											<>
												<div className="border-t border-app-border my-2 pt-2"></div>
												<p>
													<span className="opacity-70">
														{order.status ===
														"CANCELADA"
															? "Cancelamento:"
															: "Finalização:"}
													</span>
													<span className="font-medium float-right">
														{new Date(
															order.closed_at,
														).toLocaleString(
															"pt-BR",
														)}
													</span>
												</p>
												<p>
													<span className="opacity-70">
														Responsável:
													</span>
													<span className="font-medium float-right">
														{order.closedBy?.name ||
															"Sistema"}
													</span>
												</p>
											</>
										)}
									</div>
								</div>
							</div>

							{/* Relato Original */}
							<div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border">
								<h3 className="text-xs font-bold text-dwl-teal mb-3 uppercase tracking-wider">
									Relato do Problema
								</h3>
								<p className="text-sm leading-relaxed">
									{order.problem_description}
								</p>
							</div>

							{/* Motivo do Cancelamento (Caixa Vermelha) */}
							{order.status === "CANCELADA" &&
								order.cancellation_reason && (
									<div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
										<h3 className="text-xs font-bold text-red-700 dark:text-red-400 mb-3 uppercase tracking-wider">
											Motivo do Cancelamento
										</h3>
										<p className="text-sm leading-relaxed text-red-800 dark:text-red-300">
											{order.cancellation_reason}
										</p>
									</div>
								)}

							{/* Solução Aplicada (Caixa Verde) */}
							{order.status === "FINALIZADA" &&
								order.solution_description && (
									<div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
										<h3 className="text-xs font-bold text-green-700 dark:text-green-400 mb-3 uppercase tracking-wider">
											Solução Aplicada
										</h3>
										<p className="text-sm leading-relaxed text-green-800 dark:text-green-300">
											{order.solution_description}
										</p>
									</div>
								)}
						</div>
					)}

					{activeTab === "CHECKLIST" && (
						<div className="text-center py-12 opacity-50">
							Em construção...
						</div>
					)}
					{activeTab === "PECAS" && (
						<div className="text-center py-12 opacity-50">
							Em construção...
						</div>
					)}
				</div>
			</div>

			<CancelOrderModal
				isOpen={isCancelModalOpen}
				onClose={() => setIsCancelModalOpen(false)}
				onConfirm={handleCancelOrder}
			/>

			<FinishOrderModal
				isOpen={isFinishModalOpen}
				onClose={() => setIsFinishModalOpen(false)}
				onConfirm={handleFinishOrder}
			/>
		</div>
	);
}
