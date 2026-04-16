import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();

	// Função para fazer Logout (Sair)
	const handleLogout = () => {
		localStorage.removeItem("@dwl:token");
		localStorage.removeItem("@dwl:user");
		navigate("/"); // Volta pro Login
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* Barra de Navegação no topo */}
			<header className="flex items-center justify-between bg-dwl-blue p-4 text-white shadow-md">
				<h1 className="text-xl font-bold">DWL Tech Support</h1>
				<button
					onClick={handleLogout}
					className="rounded bg-dwl-red px-4 py-2 text-sm font-bold transition hover:bg-red-700"
				>
					Sair
				</button>
			</header>

			{/* Conteúdo Principal */}
			<main className="flex-1 p-8">
				<h2 className="text-2xl font-bold text-slate-800">
					Painel do Técnico
				</h2>
				<p className="mt-2 text-slate-600">
					Bem-vindo ao sistema de controle de O.S.
				</p>

				{/* Aqui no futuro nós vamos colocar os cards de O.S. Abertas, Equipamentos, etc */}
				<div className="mt-8 rounded-xl border border-dwl-border/30 bg-white p-6 shadow-sm">
					<p className="text-slate-500">
						Área de trabalho em construção... 🚧
					</p>
				</div>
			</main>
		</div>
	);
}
