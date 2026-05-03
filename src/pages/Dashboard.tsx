import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoDwl from "../assets/logo_dwl.png";
import { api } from "../services/api";
import {
	PlusCircle,
	MonitorSmartphone,
	ClipboardList,
	UserPlus,
	Search,
	ChevronLeft,
	ChevronRight,
	Users,
	XCircle, // 👈 Ícone novo importado aqui!
} from "lucide-react";

export default function Dashboard() {
	const navigate = useNavigate();
	const userStorage = localStorage.getItem("@dwl:user");
	const user = userStorage ? JSON.parse(userStorage) : null;

	const [loading, setLoading] = useState(true);

	// Balde das Métricas
	const [metrics, setMetrics] = useState({
		openOS: 0,
		completedOS: 0,
		totalEquipment: 0,
	});

	// Balde da lista original
	const [serviceOrders, setServiceOrders] = useState<any[]>([]);

	// Baldes do Filtro e Paginação
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		document.title = "Painel | DWL Tech Support";

		async function loadDashboardData() {
			try {
				const [metricsRes, osRes] = await Promise.all([
					api.get("/dashboard/metrics"),
					api.get("/serviceorder"),
				]);

				if (metricsRes.data.success) {
					setMetrics(metricsRes.data.data);
				}

				if (osRes.data.success) {
					setServiceOrders(osRes.data.data);
				}
			} catch (error) {
				console.error("Erro ao carregar painel:", error);
			} finally {
				setLoading(false);
			}
		}

		loadDashboardData();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("@dwl:token");
		localStorage.removeItem("@dwl:user");
		navigate("/");
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "ABERTA":
				return (
					<span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
						ABERTA
					</span>
				);
			case "FINALIZADA":
				return (
					<span className="bg-dwl-teal/20 text-dwl-teal px-3 py-1 rounded-full text-xs font-bold">
						FINALIZADA
					</span>
				);
			case "CANCELADA":
				return (
					<span className="bg-dwl-red/10 text-dwl-red px-3 py-1 rounded-full text-xs font-bold">
						CANCELADA
					</span>
				);
			default:
				return (
					<span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
						{status}
					</span>
				);
		}
	};

	// 🧠 INTELIGÊNCIA DO FILTRO
	const filteredOrders = serviceOrders.filter((os) => {
		const searchLower = search.toLowerCase();
		const customerName = os.customer?.name?.toLowerCase() || "";
		const serialNumber = os.equipment?.serial_number?.toLowerCase() || "";

		return (
			customerName.includes(searchLower) ||
			serialNumber.includes(searchLower)
		);
	});

	// 🧠 INTELIGÊNCIA DA PAGINAÇÃO
	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedOrders = filteredOrders.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	// 👇 CÁLCULO DAS OS CANCELADAS 👇
	const osCanceladas = serviceOrders.filter(
		(os) => os.status === "CANCELADA",
	).length;

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* CABEÇALHO */}
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-8 sm:h-9 w-auto object-contain"
					/>
					<h1 className="text-lg sm:text-xl font-extrabold text-dwl-teal hidden sm:block">
						Tech Support
					</h1>
				</div>
				<div className="flex items-center gap-4 sm:gap-6">
					<div className="text-right hidden sm:block">
						<p className="text-sm font-semibold text-slate-700">
							Olá, {user?.name || "Técnico"}
						</p>
						<p className="text-xs text-dwl-border">Plantão Ativo</p>
					</div>
					<button
						onClick={handleLogout}
						className="rounded-lg bg-dwl-red/10 px-4 py-2 text-sm font-bold text-dwl-red transition-colors hover:bg-dwl-red hover:text-white"
					>
						Sair
					</button>
				</div>
			</header>

			<main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
				<h2 className="text-xl sm:text-2xl font-bold text-slate-800">
					Painel Geral
				</h2>

				{loading ? (
					<div className="mt-12 flex justify-center text-dwl-blue font-bold animate-pulse">
						Sincronizando dados...
					</div>
				) : (
					<>
						{/* CARDS DE MÉTRICAS - Agora com 4 colunas! */}
						<div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-amber-500">
								<h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase">
									O.S. Pendentes
								</h3>
								<p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-800">
									{metrics.openOS}
								</p>
							</div>
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-teal">
								<h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase">
									O.S. Concluídas
								</h3>
								<p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-800">
									{metrics.completedOS}
								</p>
							</div>
							{/* 👇 NOVO CARD: O.S. CANCELADAS 👇 */}
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-red flex justify-between items-start">
								<div>
									<h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase">
										O.S. Canceladas
									</h3>
									<p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-800">
										{osCanceladas}
									</p>
								</div>
								<XCircle
									className="text-dwl-red opacity-20"
									size={32}
								/>
							</div>
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-blue">
								<h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase">
									Equipamentos
								</h3>
								<p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-800">
									{metrics.totalEquipment}
								</p>
							</div>
						</div>

						{/* BARRA DE BUSCA */}
						<div className="mt-10 mb-4">
							<div className="relative max-w-md">
								<input
									type="text"
									placeholder="Buscar por cliente ou S/N..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setCurrentPage(1); // Volta pra página 1 ao pesquisar
									}}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 pl-10 text-sm focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue shadow-sm"
								/>
								<Search
									className="absolute left-3 top-3 text-slate-400"
									size={18}
								/>
							</div>
						</div>

						{/* TABELA */}
						<div className="bg-white rounded-xl border border-dwl-border/30 shadow-sm overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-dwl-border/30 flex items-center gap-2">
								<ClipboardList
									className="text-dwl-blue"
									size={20}
								/>
								<h3 className="text-base sm:text-lg font-bold text-slate-800">
									Ordens de Serviço
								</h3>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
									<thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
										<tr>
											<th className="px-6 py-4">Nº OS</th>
											<th className="px-6 py-4">
												Cliente
											</th>
											<th className="px-6 py-4">
												Equipamento
											</th>
											<th className="px-6 py-4">Data</th>
											<th className="px-6 py-4 text-center">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-dwl-border/30">
										{paginatedOrders.length === 0 ? (
											<tr>
												<td
													colSpan={5}
													className="px-6 py-8 text-center text-slate-500 italic"
												>
													{search
														? "Nenhuma O.S. encontrada para esta busca."
														: "Nenhuma O.S. aberta no momento."}
												</td>
											</tr>
										) : (
											paginatedOrders.map((os) => (
												<tr
													key={os.id}
													onClick={() =>
														navigate(`/os/${os.id}`)
													}
													className="hover:bg-slate-100 transition-colors cursor-pointer"
												>
													<td className="px-6 py-4 font-bold text-dwl-blue">
														#{os.number}
													</td>
													<td className="px-6 py-4 font-medium text-slate-800">
														{os.customer?.name}
													</td>
													<td className="px-6 py-4">
														{
															os.equipment
																?.description
														}
													</td>
													<td className="px-6 py-4">
														{new Date(
															os.opened_at,
														).toLocaleDateString(
															"pt-BR",
														)}
													</td>
													<td className="px-6 py-4 text-center">
														{getStatusBadge(
															os.status,
														)}
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>

							{/* CONTROLES DE PAGINAÇÃO */}
							{totalPages > 1 && (
								<div className="bg-slate-50 border-t border-dwl-border/30 px-6 py-3 flex items-center justify-between">
									<p className="text-xs font-medium text-slate-500">
										Página {currentPage} de {totalPages}
									</p>
									<div className="flex gap-2">
										<button
											disabled={currentPage === 1}
											onClick={() =>
												setCurrentPage(
													(prev) => prev - 1,
												)
											}
											className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
										>
											<ChevronLeft size={14} /> Anterior
										</button>
										<button
											disabled={
												currentPage === totalPages
											}
											onClick={() =>
												setCurrentPage(
													(prev) => prev + 1,
												)
											}
											className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
										>
											Próxima <ChevronRight size={14} />
										</button>
									</div>
								</div>
							)}
						</div>

						{/* MENU DE AÇÕES E GESTÃO */}
						<div className="mt-8 sm:mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Coluna 1: Ações Rápidas (Criar Novos) */}
							<div>
								<h3 className="mb-4 text-lg font-bold text-slate-800">
									Ações Rápidas
								</h3>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => navigate("/os/nova")}
										className="flex items-center gap-2 rounded-lg bg-dwl-blue px-5 py-2.5 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 shadow-sm"
									>
										<PlusCircle size={18} /> Nova O.S.
									</button>
									<button
										onClick={() =>
											navigate("/equipamentos/novo")
										}
										className="flex items-center gap-2 rounded-lg border-2 border-dwl-blue bg-white px-5 py-2.5 font-bold text-dwl-blue transition-all hover:bg-dwl-blue hover:text-white active:scale-95"
									>
										<MonitorSmartphone size={18} /> Novo
										Equipamento
									</button>
									<button
										onClick={() =>
											navigate("/clientes/novo")
										}
										className="flex items-center gap-2 rounded-lg border-2 border-slate-700 bg-white px-5 py-2.5 font-bold text-slate-700 transition-all hover:bg-slate-700 hover:text-white active:scale-95"
									>
										<UserPlus size={18} /> Novo Cliente
									</button>
								</div>
							</div>

							{/* Coluna 2: Gestão (Listagens) */}
							<div>
								<h3 className="mb-4 text-lg font-bold text-slate-800">
									Gestão e Cadastros
								</h3>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => navigate("/clientes")}
										className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-300 px-5 py-2.5 font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm"
									>
										<Users
											size={18}
											className="text-dwl-blue"
										/>{" "}
										Ver Clientes
									</button>
									<button
										onClick={() =>
											navigate("/equipamentos")
										}
										className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-300 px-5 py-2.5 font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm"
									>
										<MonitorSmartphone
											size={18}
											className="text-dwl-blue"
										/>{" "}
										Ver Equipamentos
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</main>
			{/* 👇 A ASSINATURA DE MESTRE ENTRA AQUI 👇 */}
			<footer className="mt-auto py-6 text-center border-t border-dwl-border/20 bg-slate-50/50">
				<p className="text-xs font-medium text-slate-400 hover:text-slate-500 transition-colors">
					&copy; 2026 - Todos os direitos reservados - Desenvolvido
					por{" "}
					<span className="font-bold text-dwl-blue">
						@rpg Sistemas
					</span>
				</p>
			</footer>
		</div>
	);
}
