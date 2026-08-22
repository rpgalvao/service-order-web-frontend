import { useState, useEffect, type FormEvent } from "react";
import { X, Package, Save } from "lucide-react";
import { partService, type Part } from "../../services/partService";
import { supplierService, type Supplier } from "../../services/supplierService";
import { toTitleCase } from "../../utils/formatters";

interface PartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	partToEdit?: Part | null;
}

export function PartDrawer({
	isOpen,
	onClose,
	onSuccess,
	partToEdit,
}: PartDrawerProps) {
	const [name, setName] = useState("");
	const [sku, setSku] = useState("");
	const [costPrice, setCostPrice] = useState<number | string>("");
	const [salePrice, setSalePrice] = useState<number | string>("");
	const [currentStock, setCurrentStock] = useState<number | string>(0);
	const [minStock, setMinStock] = useState<number | string>(0);
	const [supplierId, setSupplierId] = useState("");
	const [active, setActive] = useState(true);

	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			supplierService
				.getSuppliers()
				.then(setSuppliers)
				.catch(console.error);

			if (partToEdit) {
				setName(partToEdit.name);
				setSku(partToEdit.sku || "");
				setCostPrice(Number(partToEdit.cost_price));
				setSalePrice(Number(partToEdit.sale_price));
				setCurrentStock(partToEdit.current_stock);
				setMinStock(partToEdit.min_stock);
				setSupplierId(partToEdit.supplierId || "");
				setActive(partToEdit.active);
			} else {
				setName("");
				setSku("");
				setCostPrice("");
				setSalePrice("");
				setCurrentStock(0);
				setMinStock(0);
				setSupplierId("");
				setActive(true);
			}
		}
	}, [isOpen, partToEdit]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const payload = {
			name: toTitleCase(name),
			sku: sku || undefined,
			cost_price: Number(costPrice),
			sale_price: Number(salePrice),
			current_stock: Number(currentStock),
			min_stock: Number(minStock),
			supplierId: supplierId || null,
			active,
		};

		try {
			if (partToEdit) {
				await partService.updatePart(partToEdit.id, payload);
			} else {
				await partService.createPart(payload);
			}
			onSuccess();
			onClose();
		} catch (err: any) {
			const msg = err.response?.data?.message || "Erro ao salvar a peça.";
			alert(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
				onClick={onClose}
			/>
			<div
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border">
					<div className="flex items-center gap-2">
						<Package className="w-5 h-5 text-dwl-teal" />
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light">
							{partToEdit ? "Editar Peça" : "Nova Peça"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					<form
						id="partForm"
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Nome da Peça{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								minLength={2}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								placeholder="Ex: Placa Principal"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								SKU (Part Number)
							</label>
							<input
								type="text"
								value={sku}
								onChange={(e) => setSku(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								placeholder="Ex: BR-9988-X"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Preço de Custo (R$){" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									step="0.01"
									min="0"
									required
									value={costPrice}
									onChange={(e) =>
										setCostPrice(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Preço de Venda (R$){" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									step="0.01"
									min="0"
									required
									value={salePrice}
									onChange={(e) =>
										setSalePrice(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Estoque Atual{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									min="0"
									required
									value={currentStock}
									onChange={(e) =>
										setCurrentStock(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Estoque Mínimo{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									min="0"
									required
									value={minStock}
									onChange={(e) =>
										setMinStock(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Fornecedor Padrão
							</label>
							<select
								value={supplierId}
								onChange={(e) => setSupplierId(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
							>
								<option value="">
									Sem fornecedor vinculado
								</option>
								{suppliers.map((sup) => (
									<option key={sup.id} value={sup.id}>
										{sup.name}
									</option>
								))}
							</select>
						</div>

						{partToEdit && (
							<div className="pt-4 border-t border-app-border mt-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={active}
										onChange={(e) =>
											setActive(e.target.checked)
										}
										className="rounded border-app-border text-dwl-teal focus:ring-dwl-teal bg-transparent"
									/>
									<span className="text-sm font-medium text-dwl-blue dark:text-dwl-light">
										Peça Ativa no Catálogo
									</span>
								</label>
							</div>
						)}
					</form>
				</div>

				<div className="p-6 border-t border-app-border bg-black/5 dark:bg-white/5">
					<button
						form="partForm"
						type="submit"
						disabled={isSubmitting}
						className="w-full py-2.5 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Salvando..." : "Salvar Peça"}
					</button>
				</div>
			</div>
		</>
	);
}
