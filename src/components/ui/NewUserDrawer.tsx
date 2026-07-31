import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { userService } from "../../services/userService";

interface NewUserDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void; // Função para avisar a tabela que deve recarregar
}

export function NewUserDrawer({
	isOpen,
	onClose,
	onSuccess,
}: NewUserDrawerProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Como o backend lida com o padrão, não precisamos enviar o "role"
			await userService.createUser({ name, email, password, phone });

			// Limpa os campos
			setName("");
			setEmail("");
			setPassword("");
			setPhone("");

			// Avisa a página pai (Users) para recarregar a lista e fecha a gaveta
			onSuccess();
			onClose();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.message ||
					"Ocorreu um erro ao criar o usuário.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/>

			<div
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-app-border flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border transition-colors duration-300">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light transition-colors">
							Novo Usuário
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
							O usuário será criado com acesso de Técnico.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
							{error}
						</div>
					)}

					<form
						id="new-user-form"
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Nome Completo
							</label>
							<input
								type="text"
								required
								minLength={2}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								E-mail
							</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Telefone
							</label>
							<input
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="(00) 00000-0000"
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Senha Provisória
							</label>
							<input
								type="password"
								required
								minLength={5}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors"
							/>
							<p className="text-xs text-dwl-blue/50 dark:text-dwl-grey mt-1">
								Mínimo de 5 caracteres.
							</p>
						</div>
					</form>
				</div>

				<div className="p-6 border-t border-app-border flex justify-end gap-3 bg-black/5 dark:bg-white/5 transition-colors duration-300">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded-lg text-sm font-medium text-dwl-blue dark:text-dwl-light hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
					>
						Cancelar
					</button>
					<button
						type="submit"
						form="new-user-form"
						disabled={isLoading}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[120px]"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							"Criar Usuário"
						)}
					</button>
				</div>
			</div>
		</>
	);
}
