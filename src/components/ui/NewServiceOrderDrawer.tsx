import { useState, useEffect, type FormEvent } from "react";
import {
	X,
	ClipboardList,
	Building2,
	Monitor,
	AlertCircle,
	Wrench,
} from "lucide-react";
import { serviceOrderService } from "../../services/serviceOrderService";
import { customerService, type Customer } from "../../services/customerService";
import {
	equipmentService,
	type Equipment,
} from "../../services/equipmentService";

interface NewServiceOrderDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function NewServiceOrderDrawer({
	isOpen,
	onClose,
	onSuccess,
}: NewServiceOrderDrawerProps) {
	// Estados do Formulário
	const [customerId, setCustomerId] = useState("");
	const [equipmentId, setEquipmentId] = useState("");
	const [type, setType] = useState<"INSTALACAO" | "PREVENTIVA" | "CORRETIVA">(
		"CORRETIVA",
	);
	const [problemDescription, setProblemDescription] = useState("");

	// Estados de Dados (Listas)
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [allEquipments, setAllEquipments] = useState<Equipment[]>([]);

	// Estados de Controle
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	// 1. Carrega os clientes e todos os equipamentos ao abrir a gaveta
	useEffect(() => {
		if (isOpen) {
			const loadData = async () => {
				setIsLoadingData(true);
				try {
					const [customersData, equipmentsData] = await Promise.all([
						customerService.getCustomers(),
						equipmentService.getEquipments(),
					]);
					setCustomers(customersData.filter((c) => c.active));
					setAllEquipments(equipmentsData);
				} catch (err) {
					console.error("Erro ao carregar dados:", err);
					setError("Falha ao carregar as listas do banco de dados.");
				} finally {
					setIsLoadingData(false);
				}
			};
			loadData();
		} else {
			// Limpa tudo ao fechar
			setCustomerId("");
			setEquipmentId("");
			setType("CORRETIVA");
			setProblemDescription("");
			setError("");
		}
	}, [isOpen]);

	// 2. A Inteligência da Cascata: Filtra os equipamentos com base no cliente selecionado
	const availableEquipments = allEquipments.filter(
		(eq) => eq.customerId === customerId,
	);

	// 3. Se o usuário trocar de cliente, limpamos o equipamento selecionado anteriormente
	useEffect(() => {
		setEquipmentId("");
	}, [customerId]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			await serviceOrderService.createOrder({
				customerId,
				equipmentId,
				type,
				problem_description: problemDescription,
			});

			onSuccess();
			onClose();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.message ||
					"Ocorreu um erro ao abrir a Ordem de Serviço.",
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
				className={`fixed top-0 right-0 h-full w-full max-w-lg bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-app-border flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border transition-colors duration-300">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light flex items-center gap-2">
							<ClipboardList className="w-5 h-5 text-dwl-teal" />
							Nova Ordem de Serviço
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
							Registre a entrada de um equipamento para
							manutenção.
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
						<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<p>{error}</p>
						</div>
					)}

					{isLoadingData ? (
						<div className="flex flex-col items-center justify-center py-12 text-dwl-blue/50 dark:text-dwl-grey">
							<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
							<p className="text-sm">
								Carregando dados necessários...
							</p>
						</div>
					) : (
						<form
							id="new-os-form"
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Vínculos Principais */}
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
										<Building2 className="w-4 h-4 text-dwl-teal" />
										Cliente{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										required
										value={customerId}
										onChange={(e) =>
											setCustomerId(e.target.value)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
									>
										<option value="">
											Selecione o cliente...
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
								</div>

								<div>
									<label className="text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
										<Monitor className="w-4 h-4 text-dwl-teal" />
										Equipamento (S/N){" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										required
										disabled={!customerId}
										value={equipmentId}
										onChange={(e) =>
											setEquipmentId(e.target.value)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
									>
										<option value="">
											{!customerId
												? "Selecione um cliente primeiro"
												: "Selecione a máquina..."}
										</option>
										{availableEquipments.map((eq) => (
											<option key={eq.id} value={eq.id}>
												{eq.serial_number}{" "}
												{eq.model?.name
													? `- ${eq.model.name}`
													: ""}
											</option>
										))}
									</select>
									{customerId &&
										availableEquipments.length === 0 && (
											<p className="text-xs text-orange-500 mt-1.5">
												Este cliente não possui
												equipamentos cadastrados.
											</p>
										)}
								</div>
							</div>

							{/* Detalhes do Serviço */}
							<div className="space-y-4 pt-4 border-t border-app-border">
								<div>
									<label className="text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 flex items-center gap-2">
										<Wrench className="w-4 h-4 text-dwl-teal" />
										Tipo de Serviço{" "}
										<span className="text-red-500">*</span>
									</label>
									<select
										required
										value={type}
										onChange={(e) =>
											setType(e.target.value as any)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
									>
										<option value="CORRETIVA">
											Manutenção Corretiva (Conserto)
										</option>
										<option value="PREVENTIVA">
											Manutenção Preventiva (Revisão)
										</option>
										<option value="INSTALACAO">
											Instalação de Equipamento
										</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Relato do Cliente / Descrição do
										Problema{" "}
										<span className="text-red-500">*</span>
									</label>
									<textarea
										required
										minLength={5}
										maxLength={255}
										rows={4}
										value={problemDescription}
										onChange={(e) =>
											setProblemDescription(
												e.target.value,
											)
										}
										placeholder="Descreva o que está acontecendo com a máquina..."
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors resize-none"
									/>
									<div className="text-right mt-1">
										<span
											className={`text-xs ${problemDescription.length > 255 ? "text-red-500" : "text-dwl-blue/50 dark:text-dwl-grey"}`}
										>
											{problemDescription.length}/255
										</span>
									</div>
								</div>
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
						form="new-os-form"
						disabled={isSubmitting || isLoadingData || !equipmentId}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[150px]"
					>
						{isSubmitting ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							"Abrir O.S."
						)}
					</button>
				</div>
			</div>
		</>
	);
}
