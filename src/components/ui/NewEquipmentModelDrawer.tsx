import { useState, type FormEvent } from "react";
import { X, Cpu } from "lucide-react";
import { equipmentModelService } from "../../services/equipmentModelService";

interface NewEquipmentModelDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function NewEquipmentModelDrawer({
	isOpen,
	onClose,
	onSuccess,
}: NewEquipmentModelDrawerProps) {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await equipmentModelService.createModel({ name });
			setName("");
			onSuccess();
			onClose();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.message ||
					"Ocorreu um erro ao criar o modelo.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/>

			<div
				className={`fixed top-0 right-0 h-full w-full max-w-sm bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-app-border flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border transition-colors duration-300">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light">
							Novo Modelo
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
							Catálogo base de equipamentos.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
							{error}
						</div>
					)}

					<form
						id="new-model-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						<div>
							<div className="flex items-center gap-2 text-dwl-teal font-medium mb-2 border-b border-app-border pb-2">
								<Cpu className="w-4 h-4" />
								<span className="text-sm">Identificação</span>
							</div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 mt-4">
								Nome do Modelo{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								minLength={2}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Ex: Microscópio Binocular X200"
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
							/>
						</div>
					</form>
				</div>

				<div className="p-6 border-t border-app-border flex justify-end gap-3 bg-black/5 dark:bg-white/5 transition-colors duration-300">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded-lg text-sm font-medium text-dwl-blue dark:text-dwl-light hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
					>
						Cancelar
					</button>
					<button
						type="submit"
						form="new-model-form"
						disabled={isLoading}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[120px]"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							"Salvar Modelo"
						)}
					</button>
				</div>
			</div>
		</>
	);
}
