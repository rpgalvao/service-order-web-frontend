import { useState, useEffect, type FormEvent } from "react";
import { X, Monitor, Hash, Cpu, Building2 } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import { customerService, type Customer } from "../../services/customerService";
import {
	equipmentModelService,
	type EquipmentModel,
} from "../../services/equipmentModelService";

interface NewEquipmentDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function NewEquipmentDrawer({
	isOpen,
	onClose,
	onSuccess,
}: NewEquipmentDrawerProps) {
	const [serialNumber, setSerialNumber] = useState("");
	const [modelId, setModelId] = useState("");
	const [customerId, setCustomerId] = useState("");
	const [status, setStatus] = useState("");

	const [customers, setCustomers] = useState<Customer[]>([]);
	const [models, setModels] = useState<EquipmentModel[]>([]);

	const [isLoadingData, setIsLoadingData] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	// Carrega os clientes e modelos sempre que a gaveta for aberta
	useEffect(() => {
		if (isOpen) {
			const loadData = async () => {
				setIsLoadingData(true);
				try {
					// Busca os dados simultaneamente para maior performance
					const [customersData, modelsData] = await Promise.all([
						customerService.getCustomers(),
						equipmentModelService.getModels(),
					]);

					// Traz apenas os registros ativos para o formulário
					setCustomers(customersData.filter((c) => c.active));
					setModels(modelsData.filter((m) => m.active));
				} catch (err) {
					console.error("Erro ao carregar listas:", err);
					setError(
						"Falha ao carregar a lista de clientes e modelos.",
					);
				} finally {
					setIsLoadingData(false);
				}
			};

			loadData();
		} else {
			// Limpa os campos quando a gaveta fecha
			setSerialNumber("");
			setModelId("");
			setCustomerId("");
			setStatus("");
			setError("");
		}
	}, [isOpen]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (!modelId) {
			setError("A seleção de um modelo base é obrigatória.");
			return;
		}

		setIsSubmitting(true);

		try {
			await equipmentService.createEquipment({
				serial_number: serialNumber, // O Zod no backend já vai dar o .toUpperCase() por segurança
				modelId,
				customerId: customerId || undefined, // Se não selecionar cliente, fica como undefined (Estoque Interno)
				status: status ? (status as any) : undefined,
			});

			onSuccess();
			onClose();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.message ||
					"Ocorreu um erro ao cadastrar o equipamento físico.",
			);
		} finally {
			setIsSubmitting(false);
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
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-app-border flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border transition-colors duration-300">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light flex items-center gap-2">
							<Monitor className="w-5 h-5 text-dwl-teal" />
							Novo Equipamento
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
							Registre uma máquina física no sistema.
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

					{isLoadingData ? (
						<div className="flex flex-col items-center justify-center py-12 text-dwl-blue/50 dark:text-dwl-grey">
							<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
							<p className="text-sm">Carregando listas...</p>
						</div>
					) : (
						<form
							id="new-equipment-form"
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Número de Série */}
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
									<Hash className="w-4 h-4 text-dwl-teal" />
									Número de Série (S/N){" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									required
									minLength={2}
									value={serialNumber}
									onChange={(e) =>
										setSerialNumber(
											e.target.value.toUpperCase(),
										)
									}
									placeholder="Ex: SN-9001-XYZ"
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors uppercase"
								/>
							</div>

							{/* Modelo Base */}
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
									<Cpu className="w-4 h-4 text-dwl-teal" />
									Modelo Base{" "}
									<span className="text-red-500">*</span>
								</label>
								<select
									required
									value={modelId}
									onChange={(e) => setModelId(e.target.value)}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
								>
									<option value="">
										Selecione um modelo...
									</option>
									{models.map((model) => (
										<option key={model.id} value={model.id}>
											{model.name}
										</option>
									))}
								</select>
							</div>

							{/* Cliente Proprietário */}
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
									<Building2 className="w-4 h-4 text-dwl-teal" />
									Cliente (Opcional)
								</label>
								<select
									value={customerId}
									onChange={(e) =>
										setCustomerId(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
								>
									<option value="">
										Nenhum (Estoque Interno)
									</option>
									{customers.map((customer) => (
										<option
											key={customer.id}
											value={customer.id}
										>
											{customer.name}
										</option>
									))}
								</select>
								<p className="text-xs text-dwl-blue/50 dark:text-dwl-grey mt-1.5">
									Deixe vazio caso o equipamento pertença ao
									estoque da empresa.
								</p>
							</div>
						</form>
					)}
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
						form="new-equipment-form"
						disabled={isSubmitting || isLoadingData}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[150px]"
					>
						{isSubmitting ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							"Salvar Equipamento"
						)}
					</button>
				</div>
			</div>
		</>
	);
}
