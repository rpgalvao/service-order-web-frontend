import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function NewOS() {
	const navigate = useNavigate();

	const [customers, setCustomers] = useState<any[]>([]);
	const [equipments, setEquipments] = useState<any[]>([]);

	const [customerId, setCustomerId] = useState("");
	const [equipmentId, setEquipmentId] = useState("");
	const [problemDescription, setProblemDescription] = useState("");

	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		document.title = "Nova O.S. | DWL Tech Support";

		async function loadFormData() {
			try {
				const [customersRes, equipmentsRes] = await Promise.all([
					api.get("/customer"),
					api.get("/equipment"),
				]);

				if (customersRes.data.success) {
					setCustomers(customersRes.data.data);
				}
				if (equipmentsRes.data.success) {
					setEquipments(equipmentsRes.data.data);
				}
			} catch (error) {
				toast.error("Erro ao carregar dados do sistema.");
			} finally {
				setPageLoading(false);
			}
		}

		loadFormData();
	}, []);

	const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCustomerId(e.target.value);
		setEquipmentId("");
	};

	const filteredEquipments = equipments.filter(
		(eq) =>
			eq.customerId === customerId ||
			(eq.customer && eq.customer.id === customerId),
	);

	const handleCreateOS = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.post("/serviceorder", {
				customerId,
				equipmentId,
				problem_description: problemDescription,
			});

			toast.success("Ordem de Serviço aberta com sucesso! 🚀");
			navigate("/dashboard");
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao abrir Ordem de Serviço.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* Header com Logo e Alinhamento Corrigido */}
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-7 sm:h-8 w-auto opacity-90"
					/>
					<div className="h-6 w-px bg-slate-200" />
					<button
						onClick={() => navigate("/dashboard")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Painel</span>
					</button>
				</div>
				<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
					Nova O.S.
				</h1>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
				<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
					{pageLoading ? (
						<div className="py-10 text-center font-bold text-dwl-blue animate-pulse">
							Sincronizando dados...
						</div>
					) : (
						<form
							onSubmit={handleCreateOS}
							className="space-y-5 sm:space-y-6"
						>
							<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">
										Cliente
									</label>
									<select
										required
										value={customerId}
										onChange={handleCustomerChange}
										// text-base impede o zoom forçado no iOS/Android
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
									>
										<option value="">
											Selecione um cliente...
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
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">
										Equipamento
									</label>
									<select
										required
										value={equipmentId}
										onChange={(e) =>
											setEquipmentId(e.target.value)
										}
										disabled={!customerId}
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue disabled:bg-slate-100 disabled:cursor-not-allowed"
									>
										<option value="">
											{!customerId
												? "Aguardando cliente..."
												: "Selecione o equipamento..."}
										</option>
										{filteredEquipments.map((equipment) => (
											<option
												key={equipment.id}
												value={equipment.id}
											>
												{equipment.description} (
												{equipment.serial_number})
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									Defeito Relatado / Problema
								</label>
								<textarea
									required
									rows={5}
									placeholder="Descreva o problema detalhadamente..."
									value={problemDescription}
									onChange={(e) =>
										setProblemDescription(e.target.value)
									}
									className="w-full resize-y rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								/>
							</div>

							<div className="flex justify-end border-t border-dwl-border/20 pt-5">
								<button
									type="submit"
									disabled={loading}
									className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-dwl-blue px-8 py-3.5 sm:py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 disabled:opacity-70"
								>
									<Save size={20} />
									{loading
										? "Abrindo O.S..."
										: "Abrir Ordem de Serviço"}
								</button>
							</div>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
