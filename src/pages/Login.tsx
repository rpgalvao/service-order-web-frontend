import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import logoDwl from "../assets/logo_dwl.png";

export function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const [isRecovering, setIsRecovering] = useState(false);
	const [recoveryEmail, setRecoveryEmail] = useState("");
	const [recoveryMessage, setRecoveryMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const response = await api.post("/login", { email, password });
			login(response.data.data.token, response.data.data.user);
			navigate("/");
		} catch (err) {
			setError("Credenciais inválidas. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRecovery = async (e: FormEvent) => {
		e.preventDefault();
		setRecoveryMessage("");
		setError("");
		setIsLoading(true);

		try {
			// Chamada real para a sua rota de esqueci a senha
			await api.post("/login/forgot-password", { email: recoveryEmail });

			setRecoveryMessage(
				"Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve.",
			);
			setRecoveryEmail("");
		} catch (err) {
			setError(
				"Ocorreu um erro ao tentar recuperar a senha. Verifique o e-mail digitado.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleMode = () => {
		setIsRecovering(!isRecovering);
		setError("");
		setRecoveryMessage("");
	};

	return (
		<div className="min-h-screen bg-app-background flex items-center justify-center p-4 transition-colors duration-300">
			<div className="max-w-md w-full bg-app-lightSurface dark:bg-app-darkSurface rounded-2xl shadow-xl border border-app-border p-8 transition-all duration-300">
				<div className="flex justify-center mb-8">
					<img
						src={logoDwl}
						alt="DWL Diagnóstica"
						className="h-16 w-auto transition-all duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
					/>
				</div>

				{isRecovering ? (
					<div className="animate-in fade-in slide-in-from-right-4 duration-300">
						<h2 className="text-2xl font-bold text-center text-dwl-blue dark:text-dwl-light mb-2 transition-colors">
							Recuperar Senha
						</h2>
						<p className="text-sm text-center text-dwl-blue/70 dark:text-dwl-grey mb-6 transition-colors">
							Digite seu e-mail para receber as instruções de
							redefinição.
						</p>

						{recoveryMessage && (
							<div className="bg-dwl-teal/10 border border-dwl-teal/20 text-dwl-teal dark:text-dwl-cyan text-sm p-3 rounded-lg mb-4 text-center">
								{recoveryMessage}
							</div>
						)}

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-4 text-center transition-colors">
								{error}
							</div>
						)}

						<form onSubmit={handleRecovery} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1 transition-colors">
									E-mail
								</label>
								<input
									type="email"
									required
									value={recoveryEmail}
									onChange={(e) =>
										setRecoveryEmail(e.target.value)
									}
									placeholder="Seu e-mail cadastrado"
									className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none transition-colors"
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-dwl-teal hover:bg-dwl-teal/90 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 shadow-sm flex justify-center items-center gap-2"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Enviar link de recuperação"
								)}
							</button>

							<button
								type="button"
								onClick={toggleMode}
								className="w-full flex items-center justify-center gap-2 text-sm text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-teal dark:hover:text-dwl-cyan transition-colors mt-4"
							>
								<ArrowLeft className="w-4 h-4" />
								Voltar para o login
							</button>
						</form>
					</div>
				) : (
					<div className="animate-in fade-in slide-in-from-left-4 duration-300">
						<h2 className="text-2xl font-bold text-center text-dwl-blue dark:text-dwl-light mb-6 transition-colors">
							Acesso ao Sistema
						</h2>

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-4 text-center transition-colors">
								{error}
							</div>
						)}

						<form onSubmit={handleLogin} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1 transition-colors">
									E-mail
								</label>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none transition-colors"
								/>
							</div>
							<div>
								<div className="flex items-center justify-between mb-1">
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light transition-colors">
										Senha
									</label>
									<button
										type="button"
										onClick={toggleMode}
										tabIndex={-1}
										className="text-xs font-medium text-dwl-teal dark:text-dwl-cyan hover:underline transition-all"
									>
										Esqueceu a senha?
									</button>
								</div>
								<input
									type="password"
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none transition-colors"
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-dwl-teal hover:bg-dwl-teal/90 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 shadow-sm flex justify-center items-center gap-2"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Entrar"
								)}
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
