import logoDwl from "./assets/logo_dwl.png";

export default function App() {
	return (
		// Fundo da tela (Agora um cinza muito claro, quase branco)
		<div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
			{/* O "Cartão" de Login (Branco puro, com sombra suave) */}
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
				{/* Cabeçalho com Logo */}
				<div className="mb-10 flex flex-col items-center">
					<img
						src={logoDwl}
						alt="DWL Tech Support Logo"
						className="mb-5 h-20 w-auto object-contain"
					/>
					{/* Título usando a cor de texto exata da logo */}
					<h2 className="text-3xl font-extrabold text-dwl-teal">
						Tech Support
					</h2>
					<p className="text-sm text-slate-600 mt-1 font-medium">
						Painel do Técnico
					</p>
				</div>

				{/* Formulário */}
				<form className="space-y-6">
					{/* Campo de Email */}
					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							E-mail
						</label>
						<input
							type="email"
							placeholder="tecnico@dwldiagnostica.com"
							// Bordas claras, texto escuro. Focus usando o azul principal.
							className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue transition"
						/>
					</div>

					{/* Campo de Senha */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm font-semibold text-slate-700">
								Senha
							</label>
							<a
								href="#"
								className="text-xs font-medium text-dwl-blue hover:text-dwl-teal transition"
							>
								Esqueceu a senha?
							</a>
						</div>
						<input
							type="password"
							placeholder="••••••••"
							className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue transition"
						/>
					</div>

					{/* Botão de Entrar usando o Azul Principal (#1E5378) */}
					<button
						type="button"
						className="w-full rounded-lg bg-dwl-blue p-3.5 text-center font-bold text-white transition-all hover:bg-dwl-teal focus:outline-none focus:ring-2 focus:ring-dwl-blue focus:ring-offset-2 active:scale-[0.98]"
					>
						Acessar Sistema
					</button>
				</form>
			</div>
		</div>
	);
}
