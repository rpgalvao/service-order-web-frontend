import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Cpu, Power, PowerOff, Edit2 } from "lucide-react";
import {
	equipmentModelService,
	type EquipmentModel,
} from "../services/equipmentModelService";
import { EquipmentModelDrawer } from "../components/ui/EquipmentModelDrawer";
import { useAuth } from "../contexts/AuthContext";

export function EquipmentModels() {
	const [models, setModels] = useState<EquipmentModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [modelToEdit, setModelToEdit] = useState<EquipmentModel | null>(null);
	const [showInactive, setShowInactive] = useState(false);

	// Pegamos o usuário para checar a permissão
	const { user } = useAuth();
	const isAdmin = user?.role === "ADMIN";

	const loadModels = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await equipmentModelService.getModels(showInactive);
			setModels(data);
		} catch (error) {
			console.error("Erro ao buscar a lista de modelos:", error);
		} finally {
			setIsLoading(false);
		}
	}, [showInactive]);

	useEffect(() => {
		loadModels();
	}, [loadModels]);

	const handleToggleStatus = async (id: string) => {
		if (!isAdmin) return;
		try {
			await equipmentModelService.toggleStatus(id);
			loadModels(); // Recarrega a lista para atualizar o status visualmente
		} catch (error) {
			console.error("Erro ao alterar status:", error);
			alert("Não foi possível alterar o status do modelo.");
		}
	};

	const filteredModels = models.filter((model) =>
		model.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
						Catálogo de Modelos
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
						Gerencie as famílias e modelos de equipamentos
						suportados.
					</p>
				</div>

				{/* Botão blindado: Apenas ADMIN */}
				{isAdmin && (
					<button
						onClick={() => {
							setModelToEdit(null);
							setIsDrawerOpen(true);
						}}
						className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
					>
						<Plus className="w-5 h-5" />
						Novo Modelo
					</button>
				)}
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				<div className="p-4 border-b border-app-border flex flex-col sm:flex-row gap-4 items-center justify-between">
					<div className="relative w-full max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dwl-blue/40 dark:text-dwl-grey" />
						<input
							type="text"
							placeholder="Buscar por nome..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all"
						/>
					</div>

					{/* 🟢 Nossa nova Flag */}
					{isAdmin && (
						<label className="flex items-center gap-2 cursor-pointer text-sm text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-teal transition-colors">
							<input
								type="checkbox"
								checked={showInactive}
								onChange={(e) =>
									setShowInactive(e.target.checked)
								}
								className="rounded border-app-border text-dwl-teal focus:ring-dwl-teal bg-transparent"
							/>
							Mostrar inativos
						</label>
					)}
				</div>

				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse min-w-[600px]">
						<thead>
							<tr className="border-b border-app-border bg-black/5 dark:bg-white/5 transition-colors">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Modelo
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
										colSpan={3}
										className="px-6 py-12 text-center"
									>
										<div className="flex flex-col items-center justify-center text-dwl-blue/50 dark:text-dwl-grey">
											<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
											<p>Carregando catálogo...</p>
										</div>
									</td>
								</tr>
							) : filteredModels.length === 0 ? (
								<tr>
									<td
										colSpan={3}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										Nenhum modelo de equipamento encontrado.
									</td>
								</tr>
							) : (
								filteredModels.map((model) => (
									<tr
										key={model.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-dwl-teal/10 flex items-center justify-center text-dwl-teal">
													<Cpu className="w-5 h-5" />
												</div>
												<p className="text-sm font-medium text-dwl-blue dark:text-dwl-light">
													{model.name}
												</p>
											</div>
										</td>
										<td className="px-6 py-4 text-center">
											<span
												className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
													model.active
														? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
														: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
												}`}
											>
												{model.active
													? "Ativo"
													: "Inativo"}
											</span>
										</td>
										<td className="px-6 py-4 text-right flex justify-end gap-2">
											{isAdmin ? (
												<>
													<button
														onClick={() => {
															setModelToEdit(
																model,
															);
															setIsDrawerOpen(
																true,
															);
														}}
														title="Editar Modelo"
														className="p-2 rounded-lg transition-colors text-dwl-blue/50 dark:text-dwl-grey hover:text-dwl-teal dark:hover:text-dwl-teal hover:bg-black/5 dark:hover:bg-white/10"
													>
														<Edit2 className="w-4 h-4" />
													</button>
													<button
														onClick={() =>
															handleToggleStatus(
																model.id,
															)
														}
														title={
															model.active
																? "Desativar Modelo"
																: "Reativar Modelo"
														}
														className={`p-2 rounded-lg transition-colors ${
															model.active
																? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
																: "text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
														}`}
													>
														{model.active ? (
															<PowerOff className="w-5 h-5" />
														) : (
															<Power className="w-5 h-5" />
														)}
													</button>
												</>
											) : (
												<span className="text-xs text-dwl-blue/40 dark:text-dwl-grey">
													Sem permissão
												</span>
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<EquipmentModelDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadModels}
				modelToEdit={modelToEdit}
			/>
		</div>
	);
}
