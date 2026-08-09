import { useState, useEffect, type FormEvent } from "react";
import { X, ArrowDownToLine, Save } from "lucide-react";
import { partService, type Part } from "../../services/partService";
import { stockMovementService } from "../../services/stockMovementService";
import { useAuth } from "../../contexts/AuthContext";
import { toTitleCase } from "../../utils/formatters";

interface StockEntryDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	preSelectedPartId?: string | null;
}

export function StockEntryDrawer({
	isOpen,
	onClose,
	onSuccess,
	preSelectedPartId,
}: StockEntryDrawerProps) {
	const { user } = useAuth();

	const [parts, setParts] = useState<Part[]>([]);
	const [partId, setPartId] = useState("");
	const [quantity, setQuantity] = useState<number | string>("");
	const [unitCost, setUnitCost] = useState<number | string>(""); // <-- NOVO ESTADO
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			partService.getParts().then(setParts).catch(console.error);

			setPartId(preSelectedPartId || "");
			setQuantity("");
			setUnitCost("");
			setReason("");
		}
	}, [isOpen, preSelectedPartId]);

	// EFEITO INTELIGENTE: Quando escolhe a peça, puxa o custo atual dela para o input
	const handlePartChange = (selectedId: string) => {
		setPartId(selectedId);
		const selectedPart = parts.find((p) => p.id === selectedId);
		if (selectedPart) {
			setUnitCost(Number(selectedPart.cost_price));
		} else {
			setUnitCost("");
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await stockMovementService.createMovement({
				partId,
				type: "IN",
				quantity: Number(quantity),
				reason: toTitleCase(reason),
				userId: user?.id,
				unit_cost: unitCost ? Number(unitCost) : undefined, // <-- ENVIA PARA A API
			});

			onSuccess();
			onClose();
		} catch (err: any) {
			const msg =
				err.response?.data?.message ||
				"Erro ao registrar a entrada no estoque.";
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
						<div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
							<ArrowDownToLine className="w-5 h-5" />
						</div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light">
							Registrar Compra (Entrada)
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
						id="entryForm"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						<div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
							<p className="text-sm text-blue-800 dark:text-blue-300">
								Esta ação adicionará unidades ao saldo atual da
								peça selecionada e criará um registro permanente
								no log de auditoria da plataforma.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Selecione a Peça{" "}
								<span className="text-red-500">*</span>
							</label>
							<select
								required
								value={partId}
								onChange={(e) =>
									handlePartChange(e.target.value)
								}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
							>
								<option value="">Selecione...</option>
								{parts.map((part) => (
									<option key={part.id} value={part.id}>
										{part.name} (Atual: {part.current_stock}
										)
									</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Qtd. Comprada{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									min="1"
									required
									value={quantity}
									onChange={(e) =>
										setQuantity(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
									placeholder="Ex: 50"
								/>
							</div>

							{/* NOVO CAMPO DE CUSTO */}
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Custo Unitário (R$)
								</label>
								<input
									type="number"
									step="0.01"
									min="0"
									required
									value={unitCost}
									onChange={(e) =>
										setUnitCost(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
									placeholder="0.00"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Motivo / Documento{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								minLength={3}
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								placeholder="Ex: Compra via Nota Fiscal nº 12345"
							/>
						</div>
					</form>
				</div>

				<div className="p-6 border-t border-app-border bg-black/5 dark:bg-white/5">
					<button
						form="entryForm"
						type="submit"
						disabled={isSubmitting}
						className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Processando..." : "Confirmar Entrada"}
					</button>
				</div>
			</div>
		</>
	);
}
