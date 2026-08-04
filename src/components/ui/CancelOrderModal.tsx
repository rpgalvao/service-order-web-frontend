import { useState, type FormEvent } from "react";
import { AlertTriangle, X } from "lucide-react";

interface CancelOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => Promise<void>;
}

export function CancelOrderModal({
	isOpen,
	onClose,
	onConfirm,
}: CancelOrderModalProps) {
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		await onConfirm(reason);
		setIsSubmitting(false);
		setReason("");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-md overflow-hidden">
				<div className="flex items-center justify-between p-4 border-b border-app-border bg-red-50 dark:bg-red-500/10">
					<div className="flex items-center gap-2 text-red-600 dark:text-red-400">
						<AlertTriangle className="w-5 h-5" />
						<h3 className="font-bold">Cancelar Ordem de Serviço</h3>
					</div>
					<button
						onClick={onClose}
						className="text-red-600/50 hover:text-red-600 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6">
					<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-2">
						Motivo do Cancelamento{" "}
						<span className="text-red-500">*</span>
					</label>
					<textarea
						required
						minLength={5}
						rows={3}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Descreva por que esta O.S. está sendo cancelada..."
						className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-red-500 resize-none"
					/>
					<div className="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
						>
							Voltar
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
						>
							{isSubmitting
								? "Cancelando..."
								: "Confirmar Cancelamento"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
