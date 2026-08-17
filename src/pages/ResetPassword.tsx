import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import logoDwl from "../assets/logo_dwl.png";

export function ResetPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	// Captura o token que veio na URL do e-mail (ex: ?token=123)
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const handleResetPassword = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (!token) {
			setError("Token de segurança inválido ou ausente.");
			return;
		}

		if (password !== confirmPassword) {
			setError("As senhas não coincidem.");
			return;
		}

		if (password.length < 6) {
			setError("A senha deve ter pelo menos 6 caracteres.");
			return;
		}

		setIsLoading(true);

		try {
			await api.post("/login/reset-password", { token, password });

			setSuccess(true);

			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (err: any) {
			const backendMessage = err.response?.data?.message;
			setError(
				backendMessage ||
					"Erro ao redefinir a senha. O link pode ter expirado.",
			);
		} finally {
			setIsLoading(false);
		}
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

				<div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
					<h2 className="text-2xl font-bold text-center text-dwl-blue dark:text-dwl-light mb-2 transition-colors">
						Criar Nova Senha
					</h2>
					<p className="text-sm text-center text-dwl-blue/70 dark:text-dwl-grey mb-6 transition-colors">
						Digite a sua nova senha de acesso abaixo.
					</p>

					{success ? (
						<div className="bg-dwl-teal/10 border border-dwl-teal/20 text-dwl-teal dark:text-dwl-cyan text-sm p-4 rounded-lg text-center flex flex-col items-center gap-2">
							<Lock className="w-8 h-8 mb-2" />
							<p className="font-bold">
								Senha atualizada com sucesso!
							</p>
							<p className="text-xs">
								Redirecionando para o login...
							</p>
						</div>
					) : (
						<form
							onSubmit={handleResetPassword}
							className="space-y-4"
						>
							{error && (
								<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-4 text-center transition-colors">
									{error}
								</div>
							)}

							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1 transition-colors">
									Nova Senha
								</label>
								<input
									type="password"
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									placeholder="••••••••"
									className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none transition-colors"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1 transition-colors">
									Confirmar Nova Senha
								</label>
								<input
									type="password"
									required
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									placeholder="••••••••"
									className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none transition-colors"
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-dwl-teal hover:bg-dwl-teal/90 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition-colors mt-4 shadow-sm flex justify-center items-center gap-2"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Salvar Nova Senha"
								)}
							</button>

							<button
								type="button"
								onClick={() => navigate("/login")}
								className="w-full flex items-center justify-center gap-2 text-sm text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-teal dark:hover:text-dwl-cyan transition-colors mt-4"
							>
								<ArrowLeft className="w-4 h-4" />
								Voltar para o login
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
