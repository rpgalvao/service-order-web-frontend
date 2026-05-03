import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save, MonitorDot } from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function EditEquipment() {
	const navigate = useNavigate();
	const { id } = useParams(); // Pega o ID da máquina lá na URL

	const [customers, setCustomers] = useState<any[]>([]);
	const [customerId, setCustomerId] = useState("");
	const [serialNumber, setSerialNumber] = useState("");
	const [description, setDescription] = useState("");

	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		document.title = "Editar Equipamento | DWL Tech Support";

		// Busca a lista de clientes E os dados do equipamento de uma vez só!
		async function loadData() {
			try {
				const [customersRes, equipmentRes] = await Promise.all([
					api.get("/customer"),
					api.get(`/equipment/${id}`),
				]);

				if (customersRes.data.success) {
					setCustomers(customersRes.data.data);
				}

				if (equipmentRes.data.success) {
					const data = equipmentRes.data.data;
					setCustomerId(data.customerId);
					setSerialNumber(data.serial_number);
					setDescription(data.description);
				}
			} catch (error) {
				toast.error("Erro ao carregar dados do equipamento.");
				navigate("/equipamentos");
			} finally {
				setPageLoading(false);
			}
		}

		loadData();
	}, [id, navigate]);

	const handleUpdateEquipment = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.put(`/equipment/${id}`, {
				customerId,
				serial_number: serialNumber,
				description,
			});

			toast.success("Equipamento atualizado com sucesso!", {
				icon: "💻",
			});
			navigate("/equipamentos"); // Volta pra lista de máquinas
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao atualizar equipamento.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-7 sm:h-8 w-auto opacity-90"
					/>
					<div className="h-6 w-[1px] bg-slate-200" />
					<button
						onClick={() => navigate("/equipamentos")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Voltar</span>
					</button>
				</div>
				<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate flex items-center gap-2">
					<MonitorDot size={20} /> Editar Equipamento
				</h1>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
				<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
					{pageLoading ? (
						<div className="py-10 text-center font-bold text-dwl-blue animate-pulse">
							Buscando informações da máquina...
						</div>
					) : (
						<form
							onSubmit={handleUpdateEquipment}
							className="space-y-5 sm:space-y-6"
						>
							<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">
										Cliente (Proprietário)
									</label>
									<select
										required
										value={customerId}
										onChange={(e) =>
											setCustomerId(e.target.value)
										}
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
									>
										<option value="">
											Selecione o dono...
										</option>
										{customers.map((c) => (
											<option key={c.id} value={c.id}>
												{c.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">
										Número de Série (S/N)
									</label>
									<input
										type="text"
										required
										value={serialNumber}
										onChange={(e) =>
											setSerialNumber(e.target.value)
										}
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 uppercase focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
									/>
								</div>
							</div>

							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									Descrição do Equipamento
								</label>
								<input
									type="text"
									required
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
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
										? "Salvando..."
										: "Atualizar Máquina"}
								</button>
							</div>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
