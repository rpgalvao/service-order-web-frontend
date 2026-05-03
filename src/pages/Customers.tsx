import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, PlusCircle, Search, Edit, Users } from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function Customers() {
	const navigate = useNavigate();

	const [customers, setCustomers] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = "Clientes | DWL Tech Support";

		async function loadCustomers() {
			try {
				const response = await api.get("/customer");
				if (response.data.success) {
					setCustomers(response.data.data);
				}
			} catch (error) {
				console.error("Erro ao carregar clientes:", error);
				toast.error("Erro ao carregar a lista de clientes.");
			} finally {
				setLoading(false);
			}
		}

		loadCustomers();
	}, []);

	// Filtro em tempo real pelo nome ou cidade
	const filteredCustomers = customers.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.city.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* HEADER PADRÃO */}
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
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Painel</span>
					</button>
				</div>
				<h1 className="flex items-center gap-2 text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
					<Users size={20} />
					Meus Clientes
				</h1>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
				{/* BARRA DE AÇÕES: Busca e Botão Novo */}
				<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="relative w-full sm:max-w-md">
						<input
							type="text"
							placeholder="Buscar por nome ou cidade..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 pl-10 text-sm focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue shadow-sm"
						/>
						<Search
							className="absolute left-3 top-3 text-slate-400"
							size={18}
						/>
					</div>

					<button
						onClick={() => navigate("/clientes/novo")}
						className="flex items-center justify-center gap-2 rounded-lg bg-dwl-blue px-6 py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 shadow-sm whitespace-nowrap"
					>
						<PlusCircle size={20} />
						Novo Cliente
					</button>
				</div>

				{/* TABELA DE CLIENTES */}
				<div className="bg-white rounded-xl border border-dwl-border/30 shadow-sm overflow-hidden">
					{loading ? (
						<div className="py-12 text-center font-bold text-dwl-blue animate-pulse">
							Carregando clientes...
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
								<thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
									<tr>
										<th className="px-6 py-4">Nome</th>
										<th className="px-6 py-4">Contato</th>
										<th className="px-6 py-4">
											Localização
										</th>
										<th className="px-6 py-4 text-center">
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-dwl-border/30">
									{filteredCustomers.length === 0 ? (
										<tr>
											<td
												colSpan={4}
												className="px-6 py-8 text-center text-slate-500 italic"
											>
												Nenhum cliente encontrado.
											</td>
										</tr>
									) : (
										filteredCustomers.map((customer) => (
											<tr
												key={customer.id}
												className="hover:bg-slate-50 transition-colors"
											>
												<td className="px-6 py-4 font-bold text-slate-800">
													{customer.name}
												</td>
												<td className="px-6 py-4">
													<div className="flex flex-col">
														<span className="font-medium text-dwl-blue">
															{customer.phone ||
																"---"}
														</span>
														<span className="text-xs text-slate-400">
															{customer.email ||
																"---"}
														</span>
													</div>
												</td>
												<td className="px-6 py-4">
													{customer.city} -{" "}
													{customer.state}
												</td>
												<td className="px-6 py-4 text-center">
													<button
														onClick={() =>
															navigate(
																`/clientes/editar/${customer.id}`,
															)
														}
														className="p-2 text-slate-400 hover:text-dwl-teal transition-colors rounded-lg hover:bg-slate-100 inline-flex"
														title="Editar Cliente"
													>
														<Edit size={18} />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
