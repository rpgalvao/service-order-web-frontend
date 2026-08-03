import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ClipboardList,
	CheckSquare,
	Wrench,
	AlertCircle,
} from "lucide-react";
import {
	serviceOrderService,
	type ServiceOrder,
} from "../services/serviceOrderService";

type TabType = "VISAO_GERAL" | "CHECKLIST" | "PECAS";

export function OrderDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [order, setOrder] = useState<ServiceOrder | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState<TabType>("VISAO_GERAL");

	const loadOrderDetails = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await serviceOrderService.getOrderById(id);
			setOrder(data);
		} catch (err: any) {
			console.error("Erro ao buscar detalhes da O.S.:", err);
			setError(
				"Não foi possível carregar as informações desta Ordem de Serviço.",
			);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadOrderDetails();
	}, [loadOrderDetails]);

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
			{/* Cabeçalho do Painel */}
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
										? "bg-blue-50 text-blue-700 border-blue-200"
										: order.status === "FINALIZADA"
											? "bg-green-50 text-green-700 border-green-200"
											: "bg-red-50 text-red-700 border-red-200"
								}`}
							>
								{order.status}
							</span>
						</div>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
							{order.customer?.name} • S/N:{" "}
							{order.equipment?.serial_number}
						</p>
					</div>
				</div>

				{/* Botões de Ação Rápida (Faremos depois) */}
				<div className="flex gap-2">
					{order.status === "ABERTA" && (
						<button className="px-4 py-2 bg-dwl-teal text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 transition-colors shadow-sm">
							Finalizar O.S.
						</button>
					)}
				</div>
			</div>

			{/* Container Principal com Abas */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				{/* Navegação das Abas */}
				<div className="flex border-b border-app-border bg-black/5 dark:bg-white/5">
					<button
						onClick={() => setActiveTab("VISAO_GERAL")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
							activeTab === "VISAO_GERAL"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<ClipboardList className="w-4 h-4" />
						Visão Geral
					</button>
					<button
						onClick={() => setActiveTab("CHECKLIST")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
							activeTab === "CHECKLIST"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<CheckSquare className="w-4 h-4" />
						Checklist
					</button>
					<button
						onClick={() => setActiveTab("PECAS")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
							activeTab === "PECAS"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<Wrench className="w-4 h-4" />
						Peças Utilizadas
					</button>
				</div>

				{/* Conteúdo da Aba Ativa */}
				<div className="flex-1 overflow-auto p-6">
					{activeTab === "VISAO_GERAL" && (
						<div className="text-dwl-blue dark:text-dwl-light">
							<h3 className="font-bold mb-2">
								Relato Inicial do Problema:
							</h3>
							<p className="p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-app-border">
								{order.problem_description}
							</p>
							{/* Adicionaremos mais detalhes aqui no próximo passo */}
						</div>
					)}

					{activeTab === "CHECKLIST" && (
						<div className="text-center py-12 text-dwl-blue/50 dark:text-dwl-grey">
							<CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>O módulo de checklist será construído aqui.</p>
						</div>
					)}

					{activeTab === "PECAS" && (
						<div className="text-center py-12 text-dwl-blue/50 dark:text-dwl-grey">
							<Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>O catálogo e aplicação de peças entrará aqui.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
