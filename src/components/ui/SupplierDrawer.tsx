import { useState, useEffect, type FormEvent } from "react";
import { X, Building2, Save } from "lucide-react";
import { supplierService, type Supplier } from "../../services/supplierService";

interface SupplierDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	supplierToEdit?: Supplier | null;
}

export function SupplierDrawer({
	isOpen,
	onClose,
	onSuccess,
	supplierToEdit,
}: SupplierDrawerProps) {
	const [name, setName] = useState("");
	const [document, setDocument] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [active, setActive] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Preenche o formulário se for edição, ou limpa se for criação
	useEffect(() => {
		if (isOpen) {
			if (supplierToEdit) {
				setName(supplierToEdit.name);
				setDocument(supplierToEdit.document || "");
				setEmail(supplierToEdit.email || "");
				setPhone(supplierToEdit.phone || "");
				setActive(supplierToEdit.active);
			} else {
				setName("");
				setDocument("");
				setEmail("");
				setPhone("");
				setActive(true);
			}
		}
	}, [isOpen, supplierToEdit]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Transforma strings vazias em undefined para o Zod aceitar perfeitamente
		const payload = {
			name,
			document: document || undefined,
			email: email || undefined,
			phone: phone || undefined,
			active,
		};

		try {
			if (supplierToEdit) {
				await supplierService.updateSupplier(
					supplierToEdit.id,
					payload,
				);
			} else {
				await supplierService.createSupplier(payload);
			}
			onSuccess();
			onClose();
		} catch (err: any) {
			const msg =
				err.response?.data?.message || "Erro ao salvar o fornecedor.";
			alert(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
				onClick={onClose}
			/>
			<div
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-app-lightSurface dark:bg-app-darkSurface shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex items-center justify-between p-6 border-b border-app-border">
					<div className="flex items-center gap-2">
						<Building2 className="w-5 h-5 text-dwl-teal" />
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light">
							{supplierToEdit
								? "Editar Fornecedor"
								: "Novo Fornecedor"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					<form
						id="supplierForm"
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								Nome / Razão Social{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								minLength={3}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								placeholder="Ex: Distribuidora Tech"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
								CNPJ / CPF
							</label>
							<input
								type="text"
								value={document}
								onChange={(e) => setDocument(e.target.value)}
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
								placeholder="Opcional"
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
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
									placeholder="Opcional"
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
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
									placeholder="Opcional"
								/>
							</div>
						</div>

						{supplierToEdit && (
							<div className="pt-4 border-t border-app-border mt-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={active}
										onChange={(e) =>
											setActive(e.target.checked)
										}
										className="rounded border-app-border text-dwl-teal focus:ring-dwl-teal bg-transparent"
									/>
									<span className="text-sm font-medium text-dwl-blue dark:text-dwl-light">
										Fornecedor Ativo
									</span>
								</label>
							</div>
						)}
					</form>
				</div>

				<div className="p-6 border-t border-app-border bg-black/5 dark:bg-white/5">
					<button
						form="supplierForm"
						type="submit"
						disabled={isSubmitting}
						className="w-full py-2.5 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Salvando..." : "Salvar Fornecedor"}
					</button>
				</div>
			</div>
		</>
	);
}
