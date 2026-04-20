import { useState } from "react";
import logoDwl from "../assets/logo_dwl.png";
import { api } from "../services/api"; // Importamos a nossa central!
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Novos estados para controlar o botão e mensagens de erro
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// A função que faz a mágica acontecer
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Impede o HTML de recarregar a página (comportamento padrão de forms)
		setErrorMessage(""); // Limpa erros anteriores
		setLoading(true); // Avisa que começou a carregar

		try {
			// Faz o POST para a rota de login do seu backend
			// (Atenção: verifique se a sua rota é '/login', '/auth' ou '/technicians/login')
			const response = await api.post("/login", {
				email,
				password,
			});

			console.log("Resposta da API:", response.data);
			const token = response.data.token || response.data.data?.token;
			const user = response.data.user || response.data.data?.user;
			if (token) {
				// Salva no navegador
				localStorage.setItem("@dwl:token", token);
				localStorage.setItem("@dwl:user", JSON.stringify(user));
				// O motorista leva o usuário para a rota do painel!
				navigate("/dashboard");
			} else {
				setErrorMessage(
					"Login efetuado, mas o Token não foi encontrado na resposta.",
				);
			}
		} catch (error: any) {
			console.error("Erro na requisição:", error);
			// Pega a mensagem de erro bonita que criamos no nosso AppError do backend
			if (error.response?.data?.message) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage(
					"Não foi possível conectar ao servidor. O backend está respirando?",
				);
			}
		} finally {
			setLoading(false); // Termina de carregar, dando certo ou errado
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-dwl-bg p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg border border-dwl-border/40">
				<div className="mb-10 flex flex-col items-center">
					<img
						src={logoDwl}
						alt="DWL Tech Support Logo"
						className="mb-6 h-20 w-auto object-contain"
					/>
					<h2 className="text-3xl font-extrabold text-dwl-teal">
						Tech Support
					</h2>
					<p className="text-sm mt-1 font-medium text-dwl-border">
						Painel do Técnico
					</p>
				</div>

				{/* Mudamos de uma <div> genérica para um <form> real, 
            e amarramos o onSubmit na nossa função! */}
				<form onSubmit={handleLogin} className="space-y-6">
					{/* Mostra a mensagem de erro em vermelho da DWL se der problema */}
					{errorMessage && (
						<div className="rounded-lg bg-dwl-red/10 p-3 text-sm text-dwl-red border border-dwl-red/20 text-center font-medium">
							{errorMessage}
						</div>
					)}

					<div>
						<label className="mb-2 block text-sm font-semibold text-slate-700">
							E-mail
						</label>
						<input
							type="email"
							required
							placeholder="tecnico@dwl.com.br"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-dwl-border/50 bg-white p-3.5 text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue transition"
						/>
					</div>

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
							required
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-dwl-border/50 bg-white p-3.5 text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue transition"
						/>
					</div>

					{/* O botão muda de tipo para 'submit' e desabilita enquanto carrega */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-dwl-blue p-3.5 text-center font-bold text-white transition-all hover:bg-dwl-teal focus:outline-none focus:ring-2 focus:ring-dwl-blue focus:ring-offset-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{loading ? "Acessando..." : "Acessar Sistema"}
					</button>
				</form>
			</div>
		</div>
	);
}
