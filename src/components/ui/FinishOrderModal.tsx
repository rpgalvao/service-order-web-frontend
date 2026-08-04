import { useState, type FormEvent } from "react";
import { CheckCircle2, X } from "lucide-react";

interface FinishOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (solution: string) => Promise<void>;
}

export function FinishOrderModal({
	isOpen,
	onClose,
	onConfirm,
}: FinishOrderModalProps) {
	const [solution, setSolution] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		await onConfirm(solution);
		setIsSubmitting(false);
		setSolution("");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-md overflow-hidden">
				<div className="flex items-center justify-between p-4 border-b border-app-border bg-green-50 dark:bg-green-500/10">
					<div className="flex items-center gap-2 text-green-700 dark:text-green-400">
						<CheckCircle2 className="w-5 h-5" />
						<h3 className="font-bold">
							Finalizar Ordem de Serviço
						</h3>
					</div>
					<button
						onClick={onClose}
						className="text-green-700/50 hover:text-green-700 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6">
					<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-2">
						Descrição da Solução (Opcional)
					</label>
					<textarea
						rows={3}
						value={solution}
						onChange={(e) => setSolution(e.target.value)}
						placeholder="Descreva o que foi feito para resolver o problema..."
						className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-green-500 resize-none"
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
							className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
						>
							{isSubmitting
								? "Finalizando..."
								: "Concluir Serviço"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
