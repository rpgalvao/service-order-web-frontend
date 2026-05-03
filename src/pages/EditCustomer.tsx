import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import {
	ArrowLeft,
	Save,
	UserCheck,
	MonitorSmartphone,
	PlusCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function EditCustomer() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");

	// NOVO: Balde para guardar os equipamentos desse cliente
	const [customerEquipments, setCustomerEquipments] = useState<any[]>([]);

	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, "");
		if (value.length > 11) value = value.slice(0, 11);
		if (value.length > 2) value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
		if (value.length > 7)
			value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
		setPhone(value);
	};

	useEffect(() => {
		document.title = "Perfil do Cliente | DWL Tech Support";

		async function loadCustomerData() {
			try {
				// Busca o cliente E os equipamentos ao mesmo tempo
				const [customerRes, equipmentRes] = await Promise.all([
					api.get(`/customer/${id}`),
					api.get("/equipment"),
				]);

				if (customerRes.data.success) {
					const data = customerRes.data.data;
					setName(data.name);
					setEmail(data.email || "");
					setPhone(data.phone || "");
					setCity(data.city);
					setState(data.state);
				}

				// Filtra a lista de equipamentos para pegar só os que têm o ID deste cliente
				if (equipmentRes.data.success) {
					const allEquipments = equipmentRes.data.data;
					const myEquipments = allEquipments.filter(
						(eq: any) => eq.customerId === id,
					);
					setCustomerEquipments(myEquipments);
				}
			} catch (error) {
				toast.error("Erro ao carregar dados do perfil.");
				navigate("/clientes");
			} finally {
				setPageLoading(false);
			}
		}

		loadCustomerData();
	}, [id, navigate]);

	const handleUpdateCustomer = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.put(`/customer/${id}`, {
				name,
				email: email || undefined,
				phone: phone || undefined,
				city,
				state,
			});

			toast.success("Cliente atualizado com sucesso!", { icon: "✅" });
			navigate("/clientes");
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao atualizar cliente.");
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
						onClick={() => navigate("/clientes")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Voltar</span>
					</button>
				</div>
				<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate flex items-center gap-2">
					<UserCheck size={20} /> Perfil do Cliente
				</h1>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8 space-y-6">
				{pageLoading ? (
					<div className="py-10 text-center font-bold text-dwl-blue animate-pulse">
						Buscando visão 360 do cliente...
					</div>
				) : (
					<>
						{/* CARD 1: DADOS CADASTRAIS */}
						<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
							<h2 className="mb-6 text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
								Dados Cadastrais
							</h2>
							<form
								onSubmit={handleUpdateCustomer}
								className="space-y-5 sm:space-y-6"
							>
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">
										Nome Completo
									</label>
									<input
										type="text"
										required
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
									/>
								</div>

								<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
									<div>
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											E-mail
										</label>
										<input
											type="email"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
										/>
									</div>
									<div>
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											Telefone / WhatsApp
										</label>
										<input
											type="text"
											value={phone}
											onChange={handlePhoneMask}
											className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-5 sm:gap-6">
									<div>
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											Cidade
										</label>
										<input
											type="text"
											required
											value={city}
											onChange={(e) =>
												setCity(e.target.value)
											}
											className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
										/>
									</div>
									<div>
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											Estado (UF)
										</label>
										<input
											type="text"
											required
											maxLength={2}
											value={state}
											onChange={(e) =>
												setState(
													e.target.value.toUpperCase(),
												)
											}
											className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue uppercase"
										/>
									</div>
								</div>

								<div className="flex justify-end pt-2">
									<button
										type="submit"
										disabled={loading}
										className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-dwl-blue px-8 py-3.5 sm:py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 disabled:opacity-70"
									>
										<Save size={20} />
										{loading
											? "Salvando..."
											: "Atualizar Cadastro"}
									</button>
								</div>
							</form>
						</div>

						{/* CARD 2: EQUIPAMENTOS VINCULADOS */}
						<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
							<div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
								<h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
									<MonitorSmartphone
										size={20}
										className="text-dwl-blue"
									/>{" "}
									Equipamentos do Cliente
								</h2>
								<button
									onClick={() =>
										navigate("/equipamentos/novo")
									}
									className="text-sm font-bold text-dwl-blue hover:text-dwl-teal transition-colors flex items-center gap-1"
								>
									<PlusCircle size={16} /> Adicionar
								</button>
							</div>

							{customerEquipments.length === 0 ? (
								<p className="text-center text-sm text-slate-500 py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
									Este cliente ainda não possui equipamentos
									cadastrados.
								</p>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{customerEquipments.map((eq) => (
										<div
											key={eq.id}
											className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:border-dwl-blue transition-colors flex flex-col gap-1"
										>
											<span className="font-bold text-slate-800">
												{eq.description}
											</span>
											<span className="text-xs font-mono text-slate-500">
												S/N: {eq.serial_number}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</>
				)}
			</main>
		</div>
	);
}
