import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoDwl from "../assets/logo_dwl.png";
import { api } from "../services/api";
import {
	PlusCircle,
	MonitorSmartphone,
	ClipboardList,
	UserPlus,
} from "lucide-react";

export default function Dashboard() {
	const navigate = useNavigate();
	const userStorage = localStorage.getItem("@dwl:user");
	const user = userStorage ? JSON.parse(userStorage) : null;

	const [loading, setLoading] = useState(true);

	// 1. Ajustado para as chaves exatas que o seu console mostrou: OS (maiúsculo) e Equipment (singular)
	const [metrics, setMetrics] = useState({
		openOS: 0,
		completedOS: 0,
		totalEquipment: 0,
	});

	const [serviceOrders, setServiceOrders] = useState<any[]>([]);

	useEffect(() => {
		document.title = "Painel | DWL Tech Support";

		async function loadDashboardData() {
			try {
				const [metricsRes, osRes] = await Promise.all([
					api.get("/dashboard/metrics"),
					api.get("/serviceorder"),
				]);

				if (metricsRes.data.success) {
					// Sincronizando com o retorno real do seu Backend
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

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-6 shadow-sm">
				<div className="flex items-center gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-9 w-auto object-contain"
					/>
					<h1 className="text-xl font-extrabold text-dwl-teal hidden sm:block">
						Tech Support
					</h1>
				</div>
				<div className="flex items-center gap-6">
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
				<h2 className="text-2xl font-bold text-slate-800">
					Painel Geral
				</h2>

				{loading ? (
					<div className="mt-8 flex justify-center text-dwl-blue font-bold animate-pulse">
						Sincronizando...
					</div>
				) : (
					<>
						{/* Cards com as chaves corrigidas */}
						<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-red">
								<h3 className="text-sm font-bold text-slate-500 uppercase">
									O.S. Pendentes
								</h3>
								<p className="mt-2 text-4xl font-extrabold text-slate-800">
									{metrics.openOS}
								</p>
							</div>
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-teal">
								<h3 className="text-sm font-bold text-slate-500 uppercase">
									O.S. Concluídas
								</h3>
								<p className="mt-2 text-4xl font-extrabold text-slate-800">
									{metrics.completedOS}
								</p>
							</div>
							<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-blue">
								<h3 className="text-sm font-bold text-slate-500 uppercase">
									Equipamentos
								</h3>
								<p className="mt-2 text-4xl font-extrabold text-slate-800">
									{metrics.totalEquipment}
								</p>
							</div>
						</div>

						{/* Tabela de O.S. com rolagem suave para Mobile */}
						<div className="mt-10 bg-white rounded-xl border border-dwl-border/30 shadow-sm overflow-hidden">
							<div className="p-6 border-b border-dwl-border/30 flex items-center gap-2">
								<ClipboardList
									className="text-dwl-blue"
									size={24}
								/>
								<h3 className="text-lg font-bold text-slate-800">
									Ordens de Serviço Recentes
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
										{serviceOrders.length === 0 ? (
											<tr>
												<td
													colSpan={5}
													className="px-6 py-8 text-center text-slate-500 italic"
												>
													Nenhuma O.S. aberta no
													momento.
												</td>
											</tr>
										) : (
											serviceOrders.map((os) => (
												<tr
													key={os.id}
													className="hover:bg-slate-50 transition-colors cursor-default"
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
						</div>

						{/* Ações Rápidas: Agora com o botão de Cliente! */}
						<div className="mt-10 mb-10">
							<h3 className="mb-4 text-lg font-bold text-slate-800">
								Ações Rápidas
							</h3>
							<div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-4">
								<button
									onClick={() => navigate("/os/nova")}
									className="flex items-center justify-center gap-2 rounded-lg bg-dwl-blue px-6 py-3.5 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95"
								>
									<PlusCircle size={22} />
									Nova O.S.
								</button>

								<button
									onClick={() =>
										navigate("/equipamentos/novo")
									}
									className="flex items-center justify-center gap-2 rounded-lg border-2 border-dwl-blue bg-white px-6 py-3 font-bold text-dwl-blue transition-all hover:bg-dwl-blue hover:text-white active:scale-95"
								>
									<MonitorSmartphone size={22} />
									Novo Equipamento
								</button>

								{/* BOTÃO NOVO: Cadastrar Cliente */}
								<button
									onClick={() => navigate("/clientes/novo")}
									className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-700 bg-white px-6 py-3 font-bold text-slate-700 transition-all hover:bg-slate-700 hover:text-white active:scale-95"
								>
									<UserPlus size={22} />
									Novo Cliente
								</button>
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
}
