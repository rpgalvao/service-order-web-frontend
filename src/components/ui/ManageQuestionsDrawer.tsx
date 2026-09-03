import { useState, useEffect, type FormEvent } from "react";
import { X, ListChecks, Plus, Trash2, Edit2, Check } from "lucide-react";
import {
	checklistTemplateService,
	type ChecklistTemplate,
	type ChecklistQuestion,
} from "../../services/checklistTemplateService";

interface ManageQuestionsDrawerProps {
	templateId: string | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ManageQuestionsDrawer({
	templateId,
	isOpen,
	onClose,
}: ManageQuestionsDrawerProps) {
	const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [newQuestionText, setNewQuestionText] = useState("");
	const [newQuestionOrder, setNewQuestionOrder] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Estados para edição inline
	const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
		null,
	);
	const [editOrder, setEditOrder] = useState(1);
	const [editText, setEditText] = useState("");

	const loadTemplate = async () => {
		if (!templateId) return;
		setIsLoading(true);
		try {
			const data =
				await checklistTemplateService.getTemplateById(templateId);
			setTemplate(data);
			if (data.questions && data.questions.length > 0) {
				setNewQuestionOrder(
					Math.max(...data.questions.map((q) => q.order)) + 1,
				);
			} else {
				setNewQuestionOrder(1);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			loadTemplate();
		} else {
			setTemplate(null);
			setNewQuestionText("");
			setEditingQuestionId(null);
		}
	}, [isOpen, templateId]);

	const handleAddQuestion = async (e: FormEvent) => {
		e.preventDefault();
		if (!templateId) return;
		setIsSubmitting(true);
		try {
			await checklistTemplateService.addQuestion(templateId, {
				text: newQuestionText,
				order: newQuestionOrder,
			});
			setNewQuestionText("");
			await loadTemplate();
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao adicionar pergunta.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateQuestion = async (questionId: string) => {
		try {
			await checklistTemplateService.updateQuestion(questionId, {
				text: editText,
				order: editOrder,
			});
			setEditingQuestionId(null);
			await loadTemplate();
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao atualizar pergunta.");
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		if (
			!confirm(
				"Deseja realmente remover esta pergunta? As O.S. antigas não serão afetadas.",
			)
		)
			return;
		try {
			await checklistTemplateService.deleteQuestion(questionId);
			await loadTemplate();
		} catch (err) {
			alert("Erro ao remover pergunta.");
		}
	};

	const startEditing = (q: ChecklistQuestion) => {
		setEditingQuestionId(q.id);
		setEditOrder(q.order);
		setEditText(q.text);
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
				onClick={onClose}
			/>
			<div
				className={`fixed top-0 right-0 h-full w-full max-w-lg bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light flex items-center gap-2">
							<ListChecks className="w-5 h-5 text-dwl-teal" />{" "}
							Gabarito: {template?.name || "Carregando..."}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 flex flex-col">
					{isLoading && !template ? (
						<div className="flex justify-center py-8">
							<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						<>
							<form
								onSubmit={handleAddQuestion}
								className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-app-border mb-8"
							>
								<h3 className="text-sm font-bold text-dwl-blue dark:text-dwl-light mb-3">
									Adicionar Pergunta
								</h3>
								<div className="flex gap-2 mb-3">
									<div className="w-20">
										<label className="block text-xs text-dwl-blue/70 dark:text-dwl-grey mb-1">
											Ordem
										</label>
										<input
											type="number"
											required
											min={1}
											value={newQuestionOrder}
											onChange={(e) =>
												setNewQuestionOrder(
													Number(e.target.value),
												)
											}
											className="w-full px-2 py-1.5 border border-app-border rounded-lg bg-transparent text-sm text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
										/>
									</div>
									<div className="flex-1">
										<label className="block text-xs text-dwl-blue/70 dark:text-dwl-grey mb-1">
											Texto da Pergunta
										</label>
										<input
											type="text"
											required
											minLength={5}
											value={newQuestionText}
											onChange={(e) =>
												setNewQuestionText(
													e.target.value,
												)
											}
											placeholder="Ex: Equipamento liga normalmente?"
											className="w-full px-3 py-1.5 border border-app-border rounded-lg bg-transparent text-sm text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
										/>
									</div>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full py-2 bg-dwl-teal text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-dwl-teal/90 disabled:opacity-50"
								>
									<Plus className="w-4 h-4" /> Adicionar ao
									Gabarito
								</button>
							</form>

							<h3 className="text-sm font-bold text-dwl-blue dark:text-dwl-light mb-3 border-b border-app-border pb-2">
								Perguntas Cadastradas
							</h3>
							{!template?.questions ||
							template.questions.length === 0 ? (
								<p className="text-sm text-center py-6 text-dwl-blue/50 dark:text-dwl-grey">
									Nenhuma pergunta cadastrada.
								</p>
							) : (
								<div className="space-y-3">
									{[...template.questions]
										.sort((a, b) => a.order - b.order)
										.map((q) => (
											<div
												key={q.id}
												className="flex items-start gap-3 p-3 bg-app-lightSurface dark:bg-app-darkSurface border border-app-border rounded-lg group"
											>
												{editingQuestionId === q.id ? (
													<div className="flex gap-2 w-full items-start">
														<input
															type="number"
															value={editOrder}
															onChange={(e) =>
																setEditOrder(
																	Number(
																		e.target
																			.value,
																	),
																)
															}
															className="w-16 px-2 py-1.5 border border-app-border rounded-lg bg-transparent text-sm focus:ring-1 focus:ring-dwl-teal"
														/>
														<input
															type="text"
															value={editText}
															onChange={(e) =>
																setEditText(
																	e.target
																		.value,
																)
															}
															className="flex-1 px-2 py-1.5 border border-app-border rounded-lg bg-transparent text-sm focus:ring-1 focus:ring-dwl-teal"
														/>
														<button
															onClick={() =>
																handleUpdateQuestion(
																	q.id,
																)
															}
															className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg"
														>
															<Check className="w-4 h-4" />
														</button>
														<button
															onClick={() =>
																setEditingQuestionId(
																	null,
																)
															}
															className="p-1.5 text-dwl-blue/50 hover:bg-black/5 rounded-lg"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												) : (
													<>
														<span className="flex items-center justify-center w-6 h-6 rounded-full bg-dwl-teal/10 text-dwl-teal text-xs font-bold shrink-0">
															{q.order}
														</span>
														<p className="text-sm text-dwl-blue dark:text-dwl-light flex-1 pt-0.5">
															{q.text}
														</p>
														<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															<button
																onClick={() =>
																	startEditing(
																		q,
																	)
																}
																className="text-dwl-blue/50 hover:text-dwl-teal p-1"
															>
																<Edit2 className="w-4 h-4" />
															</button>
															<button
																onClick={() =>
																	handleDeleteQuestion(
																		q.id,
																	)
																}
																className="text-red-500/50 hover:text-red-500 p-1"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														</div>
													</>
												)}
											</div>
										))}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}
