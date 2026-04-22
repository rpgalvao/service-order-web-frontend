import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function NewCustomer() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.title = "Novo Cliente | DWL Tech Support";
	}, []);

	const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, ""); // Tira tudo que não é número
		if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

		if (value.length > 2) value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
		if (value.length > 7)
			value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");

		setPhone(value);
	};

	const handleCreateCustomer = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.post("/customer", {
				name,
				email,
				phone,
				city,
				state,
			});

			toast.success("Cliente cadastrado com sucesso!", { icon: "👤" });
			navigate("/dashboard");
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao cadastrar cliente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-7 sm:h-8 w-auto opacity-90"
					/>
					<div className="h-6 w-[1px] bg-slate-200" />
					<button
						onClick={() => navigate("/dashboard")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Painel</span>
					</button>
				</div>
				<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
					Novo Cliente
				</h1>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
				<div className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm">
					<form
						onSubmit={handleCreateCustomer}
						className="space-y-5 sm:space-y-6"
					>
						<div>
							<label className="mb-1.5 block text-sm font-semibold text-slate-700">
								Nome Completo
							</label>
							<input
								type="text"
								required
								placeholder="Ex: Renato Silva"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
							/>
						</div>

						<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									E-mail
								</label>
								<input
									type="email"
									placeholder="cliente@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								/>
							</div>
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									Telefone / WhatsApp
								</label>
								<input
									type="text"
									placeholder="(11) 99999-9999"
									value={phone}
									onChange={handlePhoneMask}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-5 sm:gap-6">
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									Cidade
								</label>
								<input
									type="text"
									required
									value={city}
									onChange={(e) => setCity(e.target.value)}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								/>
							</div>
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">
									Estado (UF)
								</label>
								<input
									type="text"
									required
									maxLength={2}
									placeholder="SP"
									value={state}
									onChange={(e) =>
										setState(e.target.value.toUpperCase())
									}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-base sm:text-sm text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue uppercase"
								/>
							</div>
						</div>

						<div className="flex justify-end border-t border-dwl-border/20 pt-5">
							<button
								type="submit"
								disabled={loading}
								className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-dwl-blue px-8 py-3.5 sm:py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 disabled:opacity-70"
							>
								<Save size={20} />
								{loading ? "Salvando..." : "Cadastrar Cliente"}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
