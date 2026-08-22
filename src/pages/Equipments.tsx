import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Monitor, Cpu, Building2 } from "lucide-react";
import { equipmentService, type Equipment } from "../services/equipmentService";
import { useAuth } from "../contexts/AuthContext";
import { NewEquipmentModelDrawer } from "../components/ui/NewEquipmentModelDrawer";
import { NewEquipmentDrawer } from "../components/ui/NewEquipmentDrawer";

export function Equipments() {
	const [equipments, setEquipments] = useState<Equipment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Estados para as duas gavetas
	const [isModelDrawerOpen, setIsModelDrawerOpen] = useState(false);
	const [isEquipmentDrawerOpen, setIsEquipmentDrawerOpen] = useState(false);

	const { user } = useAuth();
	const isAdmin = user?.role === "ADMIN";

	const loadEquipments = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await equipmentService.getEquipments();
			setEquipments(data);
		} catch (error) {
			console.error("Erro ao buscar equipamentos:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadEquipments();
	}, [loadEquipments]);

	// Filtra pelo S/N ou pelo nome do cliente/modelo
	const filteredEquipments = equipments.filter(
		(eq) =>
			eq.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(eq.model?.name &&
				eq.model.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(eq.customer?.name &&
				eq.customer.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())),
	);

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
						Central de Equipamentos
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
						Gerencie o parque de máquinas, números de série e
						catálogo de modelos.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
					{/* Botão de Novo Modelo: Restrito a Administradores */}
					{isAdmin && (
						<button
							onClick={() => setIsModelDrawerOpen(true)}
							className="flex items-center gap-2 px-4 py-2 bg-app-lightSurface dark:bg-app-darkSurface border border-app-border hover:bg-black/5 dark:hover:bg-white/5 text-dwl-blue dark:text-dwl-light rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
						>
							<Cpu className="w-5 h-5" />
							Novo Modelo
						</button>
					)}

					{/* Botão de Novo Equipamento: Aberto a todos */}
					<button
						onClick={() => setIsEquipmentDrawerOpen(true)}
						className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
					>
						<Plus className="w-5 h-5" />
						Novo Equipamento
					</button>
				</div>
			</div>

			{/* Tabela Principal */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				<div className="p-4 border-b border-app-border">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dwl-blue/40 dark:text-dwl-grey" />
						<input
							type="text"
							placeholder="Buscar por S/N, modelo ou cliente..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse min-w-[800px]">
						<thead>
							<tr className="border-b border-app-border bg-black/5 dark:bg-white/5 transition-colors">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Equipamento (S/N)
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Cliente
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Modelo Base
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-center">
									Status Atual
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
										Carregando equipamentos...
									</td>
								</tr>
							) : filteredEquipments.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										Nenhum equipamento físico encontrado.
									</td>
								</tr>
							) : (
								filteredEquipments.map((eq) => (
									<tr
										key={eq.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-dwl-teal/10 flex items-center justify-center text-dwl-teal">
													<Monitor className="w-5 h-5" />
												</div>
												<p className="text-sm font-bold text-dwl-blue dark:text-dwl-light">
													{eq.serial_number}
												</p>
											</div>
										</td>
										<td className="px-6 py-4">
											{eq.customer ? (
												<div className="flex items-center gap-2 text-sm text-dwl-blue/80 dark:text-dwl-light">
													<Building2 className="w-4 h-4 text-dwl-blue/50 dark:text-dwl-grey" />
													{eq.customer.name}
												</div>
											) : (
												<span className="text-sm text-dwl-blue/40 dark:text-dwl-grey italic">
													Estoque Interno
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2 text-sm text-dwl-blue/80 dark:text-dwl-light">
												<Cpu className="w-4 h-4 text-dwl-blue/50 dark:text-dwl-grey" />
												{eq.model?.name ||
													"Modelo Desconhecido"}
											</div>
										</td>
										<td className="px-6 py-4 text-center">
											<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-black/5 dark:bg-white/5 border-app-border text-dwl-blue dark:text-dwl-light">
												{eq.status.replace("_", " ")}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Gavetas de Cadastro */}
			<NewEquipmentModelDrawer
				isOpen={isModelDrawerOpen}
				onClose={() => setIsModelDrawerOpen(false)}
				onSuccess={loadEquipments} // Recarrega se precisar
			/>

			<NewEquipmentDrawer
				isOpen={isEquipmentDrawerOpen}
				onClose={() => setIsEquipmentDrawerOpen(false)}
				onSuccess={loadEquipments}
			/>
		</div>
	);
}
