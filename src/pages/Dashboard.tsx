import { useState, useEffect } from "react"; // Importamos os superpoderes
import { useNavigate } from "react-router-dom";
import logoDwl from "../assets/logo_dwl.png";
import { api } from "../services/api"; // Importamos a nossa central
import { PlusCircle, MonitorSmartphone } from "lucide-react";

export default function Dashboard() {
	const navigate = useNavigate();
	useEffect(() => {
		document.title = "Dashboard | DWL Tech Support";
	}, []);
	const userStorage = localStorage.getItem("@dwl:user");
	const user = userStorage ? JSON.parse(userStorage) : null;

	// 1. Criamos os "baldes" para guardar as métricas que virão do backend
	const [loading, setLoading] = useState(true);
	const [metrics, setMetrics] = useState({
		openOS: 0,
		completedOS: 0,
		totalEquipment: 0,
	});

	// 2. O useEffect: Dispara essa função UMA ÚNICA VEZ quando a tela abre
	useEffect(() => {
		async function loadDashboardData() {
			try {
				// Tentamos buscar os dados na nossa API (mesmo que a rota ainda não exista lá no backend)
				const response = await api.get("/dashboard/metrics");

				console.log("🕵️‍♂️ RESPOSTA DO BACKEND:", response.data);

				// Se a API responder, atualizamos as métricas
				if (response.data.success) {
					setMetrics(response.data.data);
				}
			} catch (error) {
				console.error("Erro ao buscar métricas:", error);
				// Não vamos travar a tela se der erro, apenas deixamos zerado por enquanto
			} finally {
				setLoading(false); // Tiramos a tela de carregamento
			}
		}

		loadDashboardData();
	}, []); // Essa array vazia [] no final é MUITO importante. Significa: rode apenas ao abrir a tela.

	const handleLogout = () => {
		localStorage.removeItem("@dwl:token");
		localStorage.removeItem("@dwl:user");
		navigate("/");
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			<header className="flex items-center justify-between bg-white border-b border-dwl-border/30 px-6 py-4 shadow-sm">
				<div className="flex items-center gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-10 w-auto object-contain"
					/>
					<h1 className="text-xl font-extrabold text-dwl-teal hidden sm:block">
						Tech Support
					</h1>
				</div>
				<div className="flex items-center gap-6">
					<div className="text-right">
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

			<main className="flex-1 p-8">
				<h2 className="text-2xl font-bold text-slate-800">
					Painel Geral
				</h2>
				<p className="mt-2 text-slate-600">
					Acompanhe as métricas e ordens de serviço da assistência.
				</p>

				{/* Mostramos um aviso de carregamento enquanto o useEffect trabalha */}
				{loading ? (
					<div className="mt-8 flex justify-center text-dwl-blue font-bold">
						Carregando informações...
					</div>
				) : (
					// 3. Os Cards de Métricas!
					<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* Card 1: O.S. Abertas */}
						<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-red">
							<h3 className="text-sm font-bold text-slate-500 uppercase">
								O.S. Pendentes
							</h3>
							<p className="mt-2 text-4xl font-extrabold text-slate-800">
								{metrics.openOS}
							</p>
						</div>

						{/* Card 2: O.S. Concluídas */}
						<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-teal">
							<h3 className="text-sm font-bold text-slate-500 uppercase">
								O.S. Concluídas
							</h3>
							<p className="mt-2 text-4xl font-extrabold text-slate-800">
								{metrics.completedOS}
							</p>
						</div>

						{/* Card 3: Equipamentos na Base */}
						<div className="rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm border-l-4 border-l-dwl-blue">
							<h3 className="text-sm font-bold text-slate-500 uppercase">
								Equipamentos Cadastrados
							</h3>
							<p className="mt-2 text-4xl font-extrabold text-slate-800">
								{metrics.totalEquipment}
							</p>
						</div>
					</div>
				)}
				{/* --- ADICIONE ESTE BLOCO AQUI: Ações Rápidas --- */}
				<div className="mt-10">
					<h3 className="mb-4 text-lg font-bold text-slate-800">
						Ações Rápidas
					</h3>

					<div className="flex flex-wrap gap-4">
						{/* Botão Principal: Nova O.S. (Azul preenchido) */}
						<button
							onClick={() => navigate("/os/nova")}
							className="flex items-center gap-2 rounded-lg bg-dwl-blue px-6 py-3 font-bold text-white transition-all hover:bg-dwl-teal focus:outline-none focus:ring-2 focus:ring-dwl-blue focus:ring-offset-2 active:scale-95"
						>
							{/* Ícone vetorizado que respeita a cor branca! */}
							<PlusCircle className="text-white" size={24} />
							Nova Ordem de Serviço
						</button>

						{/* Botão Secundário: Novo Equipamento (Borda azul, fundo branco) */}
						<button
							onClick={() => navigate("/equipamentos/novo")}
							className="flex items-center gap-2 rounded-lg border-2 border-dwl-blue bg-white px-6 py-3 font-bold text-dwl-blue transition-all hover:bg-dwl-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-dwl-blue focus:ring-offset-2 active:scale-95 group"
						>
							{/* O group-hover faz o ícone ficar branco junto com o texto quando passa o mouse! */}
							<MonitorSmartphone
								className="text-dwl-blue transition-colors group-hover:text-white"
								size={24}
							/>
							Cadastrar Equipamento
						</button>
					</div>
				</div>
				{/* --- FIM DO BLOCO DE AÇÕES RÁPIDAS --- */}
			</main>
		</div>
	);
}
