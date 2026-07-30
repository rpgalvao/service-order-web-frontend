import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import logoDwl from "../assets/logo_dwl.png";

export function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			// Ajuste '/auth/login' para a rota exata do seu backend
			const response = await api.post("/auth/login", { email, password });

			// Assumindo que seu backend retorna { token: "..." }
			login(response.data.token);
			navigate("/"); // Redireciona para o Dashboard
		} catch (err) {
			setError("Credenciais inválidas. Tente novamente.");
		}
	};

	return (
		<div className="min-h-screen bg-app-background flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-app-lightSurface dark:bg-app-darkSurface rounded-2xl shadow-xl border border-app-border p-8">
				<div className="flex justify-center mb-8">
					<img
						src={logoDwl}
						alt="DWL Diagnóstica"
						className="h-16 w-auto dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
					/>
				</div>

				<h2 className="text-2xl font-bold text-center text-dwl-blue dark:text-dwl-light mb-6">
					Acesso ao Sistema
				</h2>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1">
							E-mail
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1">
							Senha
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-dwl-teal hover:bg-dwl-teal/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
					>
						Entrar
					</button>
				</form>
			</div>
		</div>
	);
}
