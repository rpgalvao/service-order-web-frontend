import logoDwl from "./assets/logo_dwl.png";

export default function App() {
	return (
		// Fundo da tela (Background escuro e centralizador)
		<div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
			// O "Cartão" de Login
			<div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-2xl">
				{/* Cabeçalho com Logo */}
				<div className="mb-8 flex flex-col items-center">
					<img
						src={logoDwl}
						alt="DWL Tech Support Logo"
						className="mb-4 h-20 w-auto object-contain"
					/>
					<h2 className="text-2xl font-bold text-white">
						Acesso ao Sistema
					</h2>
					<p className="text-sm text-slate-400">
						Insira suas credenciais de técnico
					</p>
				</div>

				{/* Formulário */}
				<form className="space-y-6">
					{/* Campo de Email */}
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-300">
							E-mail
						</label>
						<input
							type="email"
							placeholder="tecnico@dwl.com.br"
							className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>

					{/* Campo de Senha */}
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-300">
							Senha
						</label>
						<input
							type="password"
							placeholder="••••••••"
							className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>

					{/* Botão de Entrar */}
					<button
						type="button"
						className="w-full rounded-lg bg-blue-600 p-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
					>
						Entrar
					</button>
				</form>
			</div>
		</div>
	);
}
