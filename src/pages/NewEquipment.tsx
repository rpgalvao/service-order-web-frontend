import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function NewEquipment() {
	const navigate = useNavigate();

	const [customers, setCustomers] = useState<any[]>([]);
	const [customerId, setCustomerId] = useState("");
	const [serialNumber, setSerialNumber] = useState("");
	const [description, setDescription] = useState("");

	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		document.title = "Novo Equipamento | DWL Tech Support";

		async function loadCustomers() {
			try {
				const response = await api.get("/customer");
				if (response.data.success) {
					setCustomers(response.data.data);
				}
			} catch (error) {
				toast.error("Erro ao carregar lista de clientes.");
			} finally {
				setPageLoading(false);
			}
		}

		loadCustomers();
	}, []);

	const handleCreateEquipment = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.post("/equipment", {
				customerId,
				serial_number: serialNumber,
				description,
			});

			toast.success("Equipamento cadastrado com sucesso!", {
				icon: "💻",
				duration: 4000,
			});

			navigate("/dashboard");
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao cadastrar equipamento.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* Header Alinhado e com Logo */}
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-7 sm:h-8 w-auto opacity-90"
					/>
					<div className="h-6 w-[1px] bg-slate-200" />
					<button
						onClick={() => navigate("/dashboard")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />{" "}
						{/* mt-0.5 ajusta o alinhamento óptico do ícone */}
						<span className="text-sm sm:text-base">Painel</span>
					</button>
				</div>
				<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
					Novo Equipamento
				</h1>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
				<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
					{pageLoading ? (
						<div className="py-10 text-center font-bold text-dwl-blue animate-pulse">
							Buscando clientes...
						</div>
					) : (
						<form
							onSubmit={handleCreateEquipment}
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
										// 'text-base' resolve o zoom do mobile, 'sm:text-sm' volta ao tamanho ideal em telas grandes
										className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
									>
										<option value="">
											Selecione o cliente...
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
										placeholder="Ex: BR-123456"
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
									placeholder="Ex: Cell Dyn Ruby"
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
										: "Salvar Equipamento"}
								</button>
							</div>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
