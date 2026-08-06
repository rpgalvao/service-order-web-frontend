import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Building2, Edit2, Trash2 } from "lucide-react";
import { supplierService, type Supplier } from "../services/supplierService";
import { SupplierDrawer } from "../components/ui/SupplierDrawer";

export function Suppliers() {
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [includeInactive, setIncludeInactive] = useState(false);

	// Estados da Gaveta
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

	const loadSuppliers = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await supplierService.getSuppliers(includeInactive);
			setSuppliers(data);
		} catch (error) {
			console.error("Erro ao buscar fornecedores:", error);
		} finally {
			setIsLoading(false);
		}
	}, [includeInactive]);

	useEffect(() => {
		loadSuppliers();
	}, [loadSuppliers]);

	const handleOpenCreate = () => {
		setSupplierToEdit(null);
		setIsDrawerOpen(true);
	};

	const handleOpenEdit = (supplier: Supplier) => {
		setSupplierToEdit(supplier);
		setIsDrawerOpen(true);
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Deseja realmente inativar o fornecedor "${name}"?`))
			return;
		try {
			await supplierService.deleteSupplier(id);
			loadSuppliers();
		} catch (err) {
			alert("Erro ao inativar o fornecedor.");
		}
	};

	const filteredSuppliers = suppliers.filter(
		(s) =>
			s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(s.document && s.document.includes(searchTerm)),
	);

	return (
		<div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				{/* <div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light">
						Fornecedores
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
						Gerencie os distribuidores de peças do seu estoque.
					</p>
				</div> */}
				<button
					onClick={handleOpenCreate}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" /> Novo Fornecedor
				</button>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-app-lightSurface dark:bg-app-darkSurface p-4 rounded-xl border border-app-border">
				<div className="relative w-full max-w-md">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
					</div>
					<input
						type="text"
						placeholder="Buscar por nome ou documento..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
					/>
				</div>
				<label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-dwl-blue dark:text-dwl-light">
					<input
						type="checkbox"
						checked={includeInactive}
						onChange={(e) => setIncludeInactive(e.target.checked)}
						className="rounded border-app-border text-dwl-teal focus:ring-dwl-teal bg-transparent"
					/>
					Exibir inativos
				</label>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex-1 overflow-auto">
				<table className="w-full text-left border-collapse min-w-[700px]">
					<thead>
						<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
								Nome do Fornecedor
							</th>
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
								Documento
							</th>
							<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
								Contato
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
									colSpan={5}
									className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
								>
									Carregando...
								</td>
							</tr>
						) : filteredSuppliers.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
								>
									Nenhum fornecedor encontrado.
								</td>
							</tr>
						) : (
							filteredSuppliers.map((supplier) => (
								<tr
									key={supplier.id}
									className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-dwl-teal/10 flex items-center justify-center text-dwl-teal shrink-0">
												<Building2 className="w-4 h-4" />
											</div>
											<span className="font-medium text-sm text-dwl-blue dark:text-dwl-light">
												{supplier.name}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-light">
										{supplier.document || "-"}
									</td>
									<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-light">
										{supplier.email && (
											<div>{supplier.email}</div>
										)}
										{supplier.phone && (
											<div>{supplier.phone}</div>
										)}
										{!supplier.email &&
											!supplier.phone &&
											"-"}
									</td>
									<td className="px-6 py-4 text-center">
										<span
											className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${supplier.active ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}`}
										>
											{supplier.active
												? "Ativo"
												: "Inativo"}
										</span>
									</td>
									<td className="px-6 py-4 text-right whitespace-nowrap">
										<button
											onClick={() =>
												handleOpenEdit(supplier)
											}
											className="p-2 text-dwl-blue/60 hover:text-dwl-teal dark:text-dwl-grey dark:hover:text-dwl-teal transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 mr-1"
											title="Editar"
										>
											<Edit2 className="w-4 h-4" />
										</button>
										{supplier.active && (
											<button
												onClick={() =>
													handleDelete(
														supplier.id,
														supplier.name,
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

			<SupplierDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadSuppliers}
				supplierToEdit={supplierToEdit}
			/>
		</div>
	);
}
