import { useState, useEffect, useCallback } from "react";
import { FileSignature, Plus, Settings } from "lucide-react";
import {
	checklistTemplateService,
	type ChecklistTemplate,
} from "../services/checklistTemplateService";
import { NewChecklistModal } from "../components/ui/NewChecklistModal";
import { ManageQuestionsDrawer } from "../components/ui/ManageQuestionsDrawer";

export function Checklists() {
	const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Controles
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [managingTemplateId, setManagingTemplateId] = useState<string | null>(
		null,
	);

	const loadTemplates = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await checklistTemplateService.getTemplates();
			setTemplates(data);
		} catch (error) {
			console.error("Erro ao buscar checklists:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTemplates();
	}, [loadTemplates]);

	const handleToggleStatus = async (id: string) => {
		try {
			await checklistTemplateService.toggleStatus(id);
			loadTemplates();
		} catch (err) {
			alert("Erro ao alterar status.");
		}
	};

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light">
						Gabaritos de Checklist
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
						Gerencie os formulários de manutenção preventiva e
						instalação.
					</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" /> Novo Gabarito
				</button>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex-1 overflow-auto">
				<table className="w-full text-left border-collapse min-w-[700px]">
					<thead>
						<tr className="border-b border-app-border bg-black/5 dark:bg-white/5">
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
								Nome do Checklist
							</th>
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
								Modelo Vinculado
							</th>
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-center">
								Status
							</th>
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-right">
								Ações
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-app-border">
						{isLoading ? (
							<tr>
								<td
									colSpan={4}
									className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
								>
									Carregando...
								</td>
							</tr>
						) : templates.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
								>
									Nenhum checklist cadastrado.
								</td>
							</tr>
						) : (
							templates.map((template) => (
								<tr
									key={template.id}
									className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
								>
									<td className="px-6 py-4 font-medium text-dwl-blue dark:text-dwl-light">
										<div className="flex items-center gap-2">
											<FileSignature className="w-4 h-4 text-dwl-teal" />
											{template.name}
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-light">
										{template.model?.name || "N/A"}
									</td>
									<td className="px-6 py-4 text-center">
										<button
											onClick={() =>
												handleToggleStatus(template.id)
											}
											className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${template.active ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}`}
										>
											{template.active
												? "Ativo"
												: "Inativo"}
										</button>
									</td>
									<td className="px-6 py-4 text-right">
										<button
											onClick={() =>
												setManagingTemplateId(
													template.id,
												)
											}
											className="p-2 text-dwl-blue/60 hover:text-dwl-teal dark:text-dwl-grey dark:hover:text-dwl-teal transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
											title="Gerenciar Perguntas"
										>
											<Settings className="w-5 h-5" />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<NewChecklistModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={loadTemplates}
			/>
			<ManageQuestionsDrawer
				templateId={managingTemplateId}
				isOpen={!!managingTemplateId}
				onClose={() => setManagingTemplateId(null)}
			/>
		</div>
	);
}
