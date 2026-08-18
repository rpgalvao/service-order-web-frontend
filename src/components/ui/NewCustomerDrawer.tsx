import { useState, useRef, type FormEvent } from "react";
import { X, MapPin, Building2 } from "lucide-react";
import { customerService } from "../../services/customerService";
import { formatPhone, formatCEP, toTitleCase } from "../../utils/formatters";

interface NewCustomerDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function NewCustomerDrawer({
	isOpen,
	onClose,
	onSuccess,
}: NewCustomerDrawerProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	// Estados de Endereço
	const [zipcode, setZipcode] = useState("");
	const [address, setAddress] = useState("");
	const [number, setNumber] = useState("");
	const [complement, setComplement] = useState("");
	const [neighborhood, setNeighborhood] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// 🟢 Criamos a referência para o campo de número
	const numberInputRef = useRef<HTMLInputElement>(null);

	// Função que busca o CEP
	const fetchAddressByCep = async (cepText: string) => {
		const cleanCep = cepText.replace(/\D/g, "");

		if (cleanCep.length === 8) {
			try {
				const response = await fetch(
					`https://viacep.com.br/ws/${cleanCep}/json/`,
				);
				const data = await response.json();

				if (!data.erro) {
					setCity(toTitleCase(data.localidade));
					setState(data.uf);
					setAddress(toTitleCase(data.logradouro));
					setNeighborhood(toTitleCase(data.bairro));

					// 🟢 Coloca o cursor piscando no campo "Número"
					setTimeout(() => {
						numberInputRef.current?.focus();
					}, 100);
				}
			} catch (error) {
				console.error("Erro ao buscar CEP:", error);
			}
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await customerService.createCustomer({
				name: toTitleCase(name),
				email: email.toLowerCase() || undefined,
				phone: phone || undefined,
				zipcode: zipcode || undefined,
				city: toTitleCase(city),
				state: state.toUpperCase(),
				address: toTitleCase(address) || undefined,
				// 🟢 Enviando os novos campos para a API
				number: number || undefined,
				complement: toTitleCase(complement) || undefined,
				neighborhood: toTitleCase(neighborhood) || undefined,
			});

			// Limpa todos os campos
			setName("");
			setEmail("");
			setPhone("");
			setZipcode("");
			setAddress("");
			setNumber("");
			setComplement("");
			setNeighborhood("");
			setCity("");
			setState("");

			onSuccess();
			onClose();
		} catch (err: any) {
			console.error(err);
			setError(
				err.response?.data?.message ||
					"Ocorreu um erro ao criar o cliente.",
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
				className={`fixed top-0 right-0 h-full w-full max-w-lg bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-app-border flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border transition-colors duration-300">
					<div>
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light">
							Novo Cliente
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
							Cadastre uma nova clínica ou empresa.
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
						id="new-customer-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Seção: Dados Principais */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-dwl-teal font-medium mb-2 border-b border-app-border pb-2">
								<Building2 className="w-4 h-4" />
								<span className="text-sm">
									Dados Principais
								</span>
							</div>

							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									Nome / Razão Social{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									required
									minLength={2}
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										E-mail
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Telefone
									</label>
									<input
										type="text"
										value={phone}
										onChange={(e) =>
											setPhone(
												formatPhone(e.target.value),
											)
										}
										placeholder="(00) 00000-0000"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
									/>
								</div>
							</div>
						</div>

						{/* Seção: Endereço (Agora 100% Organizado em Grid) */}
						<div className="space-y-4 pt-2">
							<div className="flex items-center gap-2 text-dwl-teal font-medium mb-2 border-b border-app-border pb-2">
								<MapPin className="w-4 h-4" />
								<span className="text-sm">Endereço</span>
							</div>

							{/* Linha 1: CEP e Logradouro */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="sm:col-span-1">
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										CEP
									</label>
									<input
										type="text"
										value={zipcode}
										onChange={(e) => {
											const masked = formatCEP(
												e.target.value,
											);
											setZipcode(masked);
											if (masked.length === 9) {
												fetchAddressByCep(masked);
											}
										}}
										placeholder="00000-000"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal"
									/>
								</div>
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Logradouro / Rua
									</label>
									<input
										type="text"
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										placeholder="Ex: Rua das Flores"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
									/>
								</div>
							</div>

							{/* Linha 2: Número, Complemento e Bairro */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Número
									</label>
									<input
										type="text"
										ref={numberInputRef} // 🟢 Conectando o useRef aqui!
										value={number}
										onChange={(e) =>
											setNumber(e.target.value)
										}
										placeholder="Ex: 123"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Complemento
									</label>
									<input
										type="text"
										value={complement}
										onChange={(e) =>
											setComplement(e.target.value)
										}
										placeholder="Ex: Sala 4"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Bairro
									</label>
									<input
										type="text"
										value={neighborhood}
										onChange={(e) =>
											setNeighborhood(e.target.value)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal"
									/>
								</div>
							</div>

							{/* Linha 3: Cidade e UF */}
							<div className="grid grid-cols-3 gap-4">
								<div className="col-span-2">
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										Cidade{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										required
										minLength={2}
										value={city}
										onChange={(e) =>
											setCity(e.target.value)
										}
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
										UF{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										required
										minLength={2}
										maxLength={2}
										value={state}
										onChange={(e) =>
											setState(e.target.value)
										}
										placeholder="Ex: PR"
										className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal transition-colors uppercase"
									/>
								</div>
							</div>
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
						form="new-customer-form"
						disabled={isLoading}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[120px]"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							"Criar Cliente"
						)}
					</button>
				</div>
			</div>
		</>
	);
}
