import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ClipboardList,
	CheckSquare,
	Wrench,
	AlertCircle,
	RefreshCw,
	Printer,
	MessageCircle,
} from "lucide-react";
import {
	serviceOrderService,
	type ServiceOrder,
} from "../services/serviceOrderService";
import { CancelOrderModal } from "../components/ui/CancelOrderModal";
import { FinishOrderModal } from "../components/ui/FinishOrderModal";
import { partService, type Part } from "../services/partService";
import { SendWhatsAppModal } from "../components/ui/SendWhatsAppModal";

type TabType = "VISAO_GERAL" | "CHECKLIST" | "PECAS";

export function OrderDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [order, setOrder] = useState<ServiceOrder | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState<TabType>("VISAO_GERAL");

	// Estados para o preenchimento do Checklist
	const [checklistNotes, setChecklistNotes] = useState("");
	const [checklistAnswers, setChecklistAnswers] = useState<any[]>([]);
	const [isSavingChecklist, setIsSavingChecklist] = useState(false);

	// Estados dos Modais
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
	const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

	// Estados para a Aba de Peças
	const [availableParts, setAvailableParts] = useState<Part[]>([]);
	const [selectedPartId, setSelectedPartId] = useState("");
	const [selectedQuantity, setSelectedQuantity] = useState(1);
	const [isAddingPart, setIsAddingPart] = useState(false);

	// Estados para geração do PDF
	const [isExportingPdf, setIsExportingPdf] = useState(false);

	const loadOrderDetails = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await serviceOrderService.getOrderById(id);
			setOrder(data);

			if (data.checklist) {
				setChecklistNotes(data.checklist.notes || "");

				// A SUA IDEIA AQUI: Verificamos se a O.S. já foi finalizada antes.
				// Se sim, as perguntas já foram avaliadas (true). Se for nova, iniciam como não avaliadas (false).
				const isCompleted = !!data.checklist.completed_at;

				const mappedAnswers = (data.checklist.answers || []).map(
					(ans: any) => ({
						...ans,
						is_evaluated: isCompleted,
					}),
				);

				setChecklistAnswers(mappedAnswers);
			}
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

	const handleExportPdf = async () => {
		if (!id) return;
		setIsExportingPdf(true);

		try {
			// Chama a função que criamos no serviço
			const pdfUrl = await serviceOrderService.exportPdf(id);

			if (pdfUrl) {
				// Abre o PDF em uma nova aba do navegador
				window.open(pdfUrl, "_blank");
			} else {
				alert("Não foi possível obter o link do documento.");
			}
		} catch (err: any) {
			console.error(err);
			const msg =
				err.response?.data?.message ||
				"Erro ao gerar o PDF da Ordem de Serviço.";
			alert(msg);
		} finally {
			setIsExportingPdf(false);
		}
	};

	const handleSendWhatsApp = async (customPhone: string) => {
		if (!order || !id) return;

		// Limpa o telefone digitado e adiciona o DDI do Brasil (55)
		const cleanPhone = customPhone.replace(/\D/g, "");
		const whatsappNumber =
			cleanPhone.length >= 10 ? `55${cleanPhone}` : cleanPhone;

		setIsExportingPdf(true); // Usa o estado do PDF para o visual de "carregando"

		try {
			// 1. Gera o PDF e pega a URL
			const pdfUrl = await serviceOrderService.exportPdf(id);

			// 2. Monta a mensagem (sempre profissional)
			const message = `Olá, ${order.customer?.name}!\n\nAqui é da *DWL Diagnóstica*.\nA Ordem de Serviço *#${String(order.number).padStart(4, "0")}* referente ao equipamento *${order.equipment?.model?.name || "N/A"}* encontra-se com o status: *${order.status}*.\n\nVocê pode baixar o relatório técnico completo acessando o link abaixo:\n🔗 ${pdfUrl}\n\nQualquer dúvida, estamos à disposição!`;

			const encodedMessage = encodeURIComponent(message);
			const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

			// 3. Abre em uma nova aba
			window.open(whatsappUrl, "_blank");
		} catch (err: any) {
			console.error(err);
			alert("Erro ao preparar o documento para o WhatsApp.");
		} finally {
			setIsExportingPdf(false);
		}
	};

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

	const handleFinishOrder = async (
		solution: string,
		technicalNotes: string,
		signatureBase64: string,
		signerName: string,
	) => {
		if (!id) return;
		try {
			await serviceOrderService.updateOrder(id, {
				status: "FINALIZADA",
				solution_description: solution,
				technical_notes: technicalNotes,
				client_signature: signatureBase64,
				signer_name: signerName,
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

	const handleSaveChecklist = async () => {
		if (!id || !order?.checklist) return;

		// 🛡️ TRAVA BASEADA NA SUA LÓGICA: Verifica se TODAS as respostas possuem is_evaluated === true
		const allEvaluated = checklistAnswers.every((ans) => ans.is_evaluated);

		if (!allEvaluated) {
			alert(
				"Atenção: Você precisa responder com 'OK' ou 'Com Problema' para TODAS as perguntas antes de salvar!",
			);
			return;
		}

		setIsSavingChecklist(true);

		try {
			const payload = {
				notes: checklistNotes,
				answers: checklistAnswers.map((ans) => ({
					id: ans.id,
					is_ok: ans.is_ok,
					comment: ans.comment || undefined,
				})),
			};

			await serviceOrderService.updateChecklist(id, payload);
			alert("Checklist salvo com sucesso!");
			await loadOrderDetails();
		} catch (err: any) {
			console.error(err);
			const errorMessage =
				err.response?.data?.message ||
				"Erro ao salvar as respostas do checklist no servidor.";
			alert(errorMessage);
		} finally {
			setIsSavingChecklist(false);
		}
	};

	const updateAnswer = (
		answerId: string,
		field: "is_ok" | "comment",
		value: any,
	) => {
		setChecklistAnswers((prev) =>
			prev.map((ans) => {
				if (ans.id === answerId) {
					return {
						...ans,
						[field]: value,
						// Se o clique foi no botão (is_ok), ativamos a avaliação daquele item
						is_evaluated:
							field === "is_ok" ? true : ans.is_evaluated,
					};
				}
				return ans;
			}),
		);
	};

	// ----------------------------------------

	// Carrega as peças ativas apenas quando a aba de Peças for acessada
	useEffect(() => {
		if (activeTab === "PECAS" && availableParts.length === 0) {
			partService
				.getParts(false)
				.then(setAvailableParts)
				.catch(console.error);
		}
	}, [activeTab, availableParts.length]);

	const handleAddPart = async () => {
		if (!id || !selectedPartId || selectedQuantity < 1) return;
		setIsAddingPart(true);
		try {
			await serviceOrderService.addPart(
				id,
				selectedPartId,
				selectedQuantity,
			);
			alert("Peça adicionada e estoque atualizado com sucesso!");
			setSelectedPartId("");
			setSelectedQuantity(1);
			await loadOrderDetails(); // Recarrega a O.S. para mostrar a peça na lista
		} catch (err: any) {
			const msg =
				err.response?.data?.message || "Erro ao adicionar peça.";
			alert(msg);
		} finally {
			setIsAddingPart(false);
		}
	};

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
					{/* 🟢 Botão do WhatsApp (Pintado de verde) */}
					<button
						onClick={() => setIsWhatsAppModalOpen(true)} // 🟢 Agora ele abre o modal!
						disabled={isExportingPdf}
						className="flex items-center gap-2 px-4 py-2 border border-green-500/50 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-500/10 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-500/20 disabled:opacity-50 transition-colors shadow-sm"
						title="Enviar por WhatsApp"
					>
						<MessageCircle className="w-4 h-4" />
						WhatsApp
					</button>

					{/* 🟢 Botão de Gerar PDF (Sempre visível) */}
					<button
						onClick={handleExportPdf}
						disabled={isExportingPdf}
						className="flex items-center gap-2 px-4 py-2 border border-dwl-teal text-dwl-teal rounded-lg text-sm font-medium hover:bg-dwl-teal/10 disabled:opacity-50 transition-colors"
						title="Imprimir Relatório"
					>
						<Printer className="w-4 h-4" />
						{isExportingPdf ? "Gerando..." : "Gerar PDF"}
					</button>

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

							{/* 🟢 NOVO: Observações Técnicas (Caixa Amarela) */}
							{order.status === "FINALIZADA" &&
								order.technical_notes && (
									<div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 mt-4">
										<h3 className="text-xs font-bold text-amber-700 dark:text-amber-500 mb-3 uppercase tracking-wider">
											Observações Técnicas (Mal uso,
											Infraestrutura, etc)
										</h3>
										<p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
											{order.technical_notes}
										</p>
									</div>
								)}

							{/* 🟢 NOVO: Exibição da Assinatura Coletada */}
							{order.client_signature && (
								<div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border mt-4">
									<h3 className="text-xs font-bold text-dwl-teal mb-3 uppercase tracking-wider">
										Assinatura do Cliente
									</h3>
									<div className="bg-white p-2 rounded border border-gray-200 inline-block">
										<img
											src={order.client_signature}
											alt="Assinatura do Cliente"
											className="h-24 object-contain filter contrast-125 grayscale"
										/>
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === "CHECKLIST" && (
						<div className="space-y-6 text-dwl-blue dark:text-dwl-light animate-in fade-in max-w-4xl mx-auto">
							{order.type === "CORRETIVA" ? (
								<div className="text-center py-12 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border">
									<CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
									<p className="font-medium">
										O Checklist não se aplica a este
										serviço.
									</p>
									<p className="text-sm opacity-70 mt-1">
										Conforme as regras do sistema,
										checklists são gerados apenas para
										serviços do tipo Preventiva ou
										Instalação.
									</p>
								</div>
							) : !order.checklist ||
							  checklistAnswers.length === 0 ? (
								<div className="text-center py-12 bg-black/5 dark:bg-white/5 rounded-xl border border-app-border">
									<p className="font-medium">
										Nenhum gabarito de checklist localizado.
									</p>
									<p className="text-sm opacity-70 mt-1">
										O modelo deste equipamento pode não ter
										um gabarito ativo no momento da abertura
										da O.S.
									</p>
								</div>
							) : (
								<>
									<div className="flex justify-between items-end border-b border-app-border pb-4">
										<div>
											<h3 className="font-bold text-lg">
												Questionário de Análise
											</h3>
											<p className="text-sm opacity-70">
												{order.checklist.completed_at
													? `Finalizado em: ${new Date(order.checklist.completed_at).toLocaleString("pt-BR")}`
													: "Preencha os itens abaixo durante a intervenção técnica."}
											</p>
										</div>
									</div>

									<div className="space-y-4">
										{checklistAnswers.map((answer) => (
											<div
												key={answer.id}
												className="p-4 bg-app-lightSurface dark:bg-app-darkSurface border border-app-border rounded-xl shadow-sm transition-colors focus-within:border-dwl-teal"
											>
												<div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-3">
													<div className="flex items-start gap-3 flex-1">
														<span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 text-xs font-bold shrink-0 mt-0.5">
															{answer.order}
														</span>
														<p className="font-medium text-sm leading-relaxed">
															{
																answer.question_text
															}
														</p>
													</div>

													{/* Botões de Ação (OK / Defeito) */}
													<div className="flex gap-2 shrink-0">
														<button
															onClick={() =>
																updateAnswer(
																	answer.id,
																	"is_ok",
																	true,
																)
															}
															disabled={
																order.status !==
																"ABERTA"
															}
															className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
																answer.is_evaluated &&
																answer.is_ok ===
																	true
																	? "bg-green-600 text-white border-green-600"
																	: "bg-transparent text-dwl-blue/50 dark:text-dwl-grey border-app-border hover:bg-black/5 disabled:opacity-50"
															}`}
														>
															OK
														</button>
														<button
															onClick={() =>
																updateAnswer(
																	answer.id,
																	"is_ok",
																	false,
																)
															}
															disabled={
																order.status !==
																"ABERTA"
															}
															className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
																answer.is_evaluated &&
																answer.is_ok ===
																	false
																	? "bg-red-600 text-white border-red-600"
																	: "bg-transparent text-dwl-blue/50 dark:text-dwl-grey border-app-border hover:bg-black/5 disabled:opacity-50"
															}`}
														>
															Com Problema
														</button>
													</div>
												</div>

												{/* Campo de Observação Específica do Item */}
												<div className="pl-9">
													<input
														type="text"
														placeholder="Observações sobre este item (opcional)..."
														value={
															answer.comment || ""
														}
														onChange={(e) =>
															updateAnswer(
																answer.id,
																"comment",
																e.target.value,
															)
														}
														disabled={
															order.status !==
															"ABERTA"
														}
														className="w-full text-sm px-3 py-1.5 border border-app-border rounded bg-transparent focus:ring-1 focus:ring-dwl-teal disabled:opacity-50"
													/>
												</div>
											</div>
										))}
									</div>

									{/* Campo de Notas Gerais do Checklist */}
									<div className="mt-8">
										<label className="block text-sm font-bold text-dwl-teal uppercase tracking-wider mb-2">
											Observações Gerais do Checklist
										</label>
										<textarea
											rows={4}
											placeholder="Anote considerações finais sobre o equipamento como um todo..."
											value={checklistNotes}
											onChange={(e) =>
												setChecklistNotes(
													e.target.value,
												)
											}
											disabled={order.status !== "ABERTA"}
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-sm focus:ring-1 focus:ring-dwl-teal resize-none disabled:opacity-50"
										/>
									</div>

									{/* Botão de Salvar (Apenas se a OS estiver aberta) */}
									{order.status === "ABERTA" && (
										<div className="flex justify-end pt-4">
											<button
												onClick={handleSaveChecklist}
												disabled={isSavingChecklist}
												className="px-6 py-2.5 bg-dwl-teal text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 disabled:opacity-50 shadow-sm flex items-center gap-2"
											>
												{isSavingChecklist
													? "Salvando..."
													: "Salvar Respostas do Checklist"}
											</button>
										</div>
									)}
								</>
							)}
						</div>
					)}
					{activeTab === "PECAS" && (
						<div className="space-y-6 text-dwl-blue dark:text-dwl-light animate-in fade-in max-w-4xl mx-auto">
							{/* Formulário de Adição de Peças (Aparece apenas se O.S. estiver aberta) */}
							{order.status === "ABERTA" && (
								<div className="p-4 bg-app-lightSurface dark:bg-app-darkSurface border border-app-border rounded-xl shadow-sm mb-6">
									<h3 className="text-sm font-bold text-dwl-teal mb-4 uppercase tracking-wider">
										Aplicar Peça no Equipamento
									</h3>
									<div className="flex flex-col sm:flex-row gap-4 items-end">
										<div className="flex-1 w-full">
											<label className="block text-sm font-medium mb-1.5">
												Buscar Peça no Catálogo
											</label>
											<select
												value={selectedPartId}
												onChange={(e) =>
													setSelectedPartId(
														e.target.value,
													)
												}
												className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
											>
												<option value="">
													Selecione uma peça...
												</option>
												{availableParts.map((part) => (
													<option
														key={part.id}
														value={part.id}
														disabled={
															part.current_stock <
															1
														}
													>
														{part.name} (Estoque:{" "}
														{part.current_stock}) -
														R${" "}
														{Number(
															part.sale_price,
														).toFixed(2)}
													</option>
												))}
											</select>
										</div>
										<div className="w-full sm:w-32">
											<label className="block text-sm font-medium mb-1.5">
												Quantidade
											</label>
											<input
												type="number"
												min="1"
												value={selectedQuantity}
												onChange={(e) =>
													setSelectedQuantity(
														Number(e.target.value),
													)
												}
												className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
											/>
										</div>
										<button
											onClick={handleAddPart}
											disabled={
												!selectedPartId || isAddingPart
											}
											className="w-full sm:w-auto px-6 py-2 bg-dwl-teal text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 disabled:opacity-50 transition-colors shadow-sm"
										>
											{isAddingPart
												? "Salvando..."
												: "Adicionar"}
										</button>
									</div>
								</div>
							)}

							{/* Lista de Peças Já Utilizadas */}
							<h3 className="font-bold text-lg mb-4">
								Peças Aplicadas nesta O.S.
							</h3>
							<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm overflow-hidden">
								<table className="w-full text-left border-collapse">
									<thead>
										<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
											<th className="px-6 py-4 text-sm font-semibold">
												Peça / SKU
											</th>
											<th className="px-6 py-4 text-sm font-semibold text-center">
												Quantidade
											</th>
											<th className="px-6 py-4 text-sm font-semibold text-right">
												Valor Unit.
											</th>
											<th className="px-6 py-4 text-sm font-semibold text-right">
												Subtotal
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-app-border">
										{!order.parts_replaced ||
										order.parts_replaced.length === 0 ? (
											<tr>
												<td
													colSpan={4}
													className="px-6 py-8 text-center text-dwl-blue/50 dark:text-dwl-grey text-sm"
												>
													Nenhuma peça foi aplicada
													nesta ordem de serviço até o
													momento.
												</td>
											</tr>
										) : (
											order.parts_replaced.map((item) => (
												<tr
													key={item.id}
													className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
												>
													<td className="px-6 py-4">
														<div className="font-medium text-sm">
															{item.part.name}
														</div>
														<div className="text-xs opacity-70 mt-0.5">
															SKU:{" "}
															{item.part.sku ||
																"N/A"}
														</div>
													</td>
													<td className="px-6 py-4 text-sm text-center font-medium">
														{item.quantity} un
													</td>
													<td className="px-6 py-4 text-sm text-right">
														R${" "}
														{Number(
															item.unit_price,
														).toFixed(2)}
													</td>
													<td className="px-6 py-4 text-sm font-bold text-dwl-teal text-right">
														R${" "}
														{(
															item.quantity *
															Number(
																item.unit_price,
															)
														).toFixed(2)}
													</td>
												</tr>
											))
										)}
									</tbody>
									{/* Rodapé com Total (Opcional, se houver peças) */}
									{order.parts_replaced &&
										order.parts_replaced.length > 0 && (
											<tfoot className="bg-black/5 dark:bg-white/5 border-t border-app-border">
												<tr>
													<td
														colSpan={3}
														className="px-6 py-4 text-sm font-bold text-right uppercase"
													>
														Custo Total em Peças:
													</td>
													<td className="px-6 py-4 text-lg font-bold text-dwl-teal text-right">
														R${" "}
														{order.parts_replaced
															.reduce(
																(acc, item) =>
																	acc +
																	item.quantity *
																		Number(
																			item.unit_price,
																		),
																0,
															)
															.toFixed(2)}
													</td>
												</tr>
											</tfoot>
										)}
								</table>
							</div>
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

			<SendWhatsAppModal
				isOpen={isWhatsAppModalOpen}
				onClose={() => setIsWhatsAppModalOpen(false)}
				defaultPhone={order.customer?.phone}
				onConfirm={handleSendWhatsApp}
			/>
		</div>
	);
}
