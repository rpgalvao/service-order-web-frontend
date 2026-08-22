import { useState, useEffect, type FormEvent } from "react";
import { MessageCircle, X } from "lucide-react";
import { formatPhone } from "../../utils/formatters";

interface SendWhatsAppModalProps {
	isOpen: boolean;
	onClose: () => void;
	defaultPhone?: string | null;
	onConfirm: (phone: string) => Promise<void>;
}

export function SendWhatsAppModal({
	isOpen,
	onClose,
	defaultPhone,
	onConfirm,
}: SendWhatsAppModalProps) {
	const [phone, setPhone] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Quando o modal abre, preenche com o telefone do cadastro (se existir)
	useEffect(() => {
		if (isOpen) {
			setPhone(defaultPhone ? formatPhone(defaultPhone) : "");
		}
	}, [isOpen, defaultPhone]);

	if (!isOpen) return null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const cleanPhone = phone.replace(/\D/g, "");

		if (cleanPhone.length < 10) {
			alert("Por favor, insira um número de WhatsApp válido com DDD.");
			return;
		}

		setIsSubmitting(true);
		await onConfirm(phone);
		setIsSubmitting(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-sm overflow-hidden">
				<div className="flex items-center justify-between p-4 border-b border-app-border bg-green-50 dark:bg-green-500/10">
					<div className="flex items-center gap-2 text-green-700 dark:text-green-400">
						<MessageCircle className="w-5 h-5" />
						<h3 className="font-bold">Enviar O.S. por WhatsApp</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-green-700/50 hover:text-green-700 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mb-4">
						Confirme ou altere o número para onde o link da Ordem de
						Serviço será enviado.
					</p>

					<div className="mb-6">
						<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
							Número do WhatsApp
						</label>
						<input
							type="text"
							required
							value={phone}
							onChange={(e) =>
								setPhone(formatPhone(e.target.value))
							}
							placeholder="(00) 00000-0000"
							className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-green-500"
						/>
					</div>

					<div className="flex justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 shadow-sm"
						>
							{isSubmitting ? "Preparando..." : "Abrir WhatsApp"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
