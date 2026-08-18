import { useState, useRef, type FormEvent } from "react";
import { CheckCircle2, X, Eraser, PenLine } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface FinishOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	// 🟢 Agora exigimos os 3 parâmetros para fechar a O.S!
	onConfirm: (
		solution: string,
		technicalNotes: string,
		signature: string,
	) => Promise<void>;
}

export function FinishOrderModal({
	isOpen,
	onClose,
	onConfirm,
}: FinishOrderModalProps) {
	const [solution, setSolution] = useState("");
	const [technicalNotes, setTechnicalNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Referência do Canvas
	const sigCanvas = useRef<SignatureCanvas>(null);

	if (!isOpen) return null;

	const handleClearSignature = () => {
		sigCanvas.current?.clear();
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!solution.trim()) {
			alert("A descrição da solução é obrigatória.");
			return;
		}

		if (sigCanvas.current?.isEmpty()) {
			alert(
				"A assinatura do cliente é obrigatória para finalizar a O.S.",
			);
			return;
		}

		setIsSubmitting(true);

		// 🟢 Usamos getCanvas direto para evitar o erro do getTrimmedCanvas no Vite
		const signatureBase64 = sigCanvas.current
			?.getCanvas()
			.toDataURL("image/png");

		if (signatureBase64) {
			await onConfirm(solution, technicalNotes, signatureBase64);
		}

		setIsSubmitting(false);

		// Limpeza
		setSolution("");
		setTechnicalNotes("");
		sigCanvas.current?.clear();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			{/* Aumentamos o max-w para caber tudo sem amontoar, e adicionamos max-h com scroll interno */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
				{/* Cabeçalho Fixo */}
				<div className="flex items-center justify-between p-4 border-b border-app-border bg-green-50 dark:bg-green-500/10 shrink-0">
					<div className="flex items-center gap-2 text-green-700 dark:text-green-400">
						<CheckCircle2 className="w-5 h-5" />
						<h3 className="font-bold text-sm sm:text-base">
							Finalizar Ordem de Serviço
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded text-green-700/50 hover:text-green-700 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Corpo com Scroll */}
				<form
					id="finish-os-form"
					onSubmit={handleSubmit}
					className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
				>
					{/* Área de Textos */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex flex-col">
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-2">
								Solução Aplicada{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								rows={4}
								value={solution}
								onChange={(e) => setSolution(e.target.value)}
								placeholder="O que foi feito..."
								required
								className="w-full flex-1 px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-green-500 resize-none"
							/>
						</div>

						<div className="flex flex-col">
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-2">
								Notas Técnicas{" "}
								<span className="text-xs opacity-60 font-normal">
									(Opcional)
								</span>
							</label>
							<textarea
								rows={4}
								value={technicalNotes}
								onChange={(e) =>
									setTechnicalNotes(e.target.value)
								}
								placeholder="Condições de infraestrutura, mal uso..."
								className="w-full flex-1 px-3 py-2 border border-amber-500/30 rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-amber-500 resize-none"
							/>
						</div>
					</div>

					{/* Área de Assinatura */}
					<div className="border border-app-border rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
						<div className="bg-dwl-teal/10 px-4 py-2 flex items-center gap-2 border-b border-app-border">
							<PenLine className="w-4 h-4 text-dwl-teal" />
							<span className="text-sm font-bold text-dwl-teal">
								Assinatura do Cliente
							</span>
						</div>

						<div className="p-4">
							<div className="border-2 border-dashed border-app-border rounded-lg overflow-hidden bg-white relative">
								{/* 🟢 touch-none impede que a tela do celular suba/desça enquanto o cliente assina */}
								<SignatureCanvas
									ref={sigCanvas}
									penColor="black"
									canvasProps={{
										className:
											"w-full h-32 sm:h-40 cursor-crosshair touch-none",
									}}
									backgroundColor="rgba(255, 255, 255, 0)"
								/>
								<button
									type="button"
									onClick={handleClearSignature}
									className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors shadow-sm border border-gray-300"
								>
									<Eraser className="w-3 h-3" /> Limpar
								</button>
							</div>
							<p className="text-xs text-center mt-2 opacity-60">
								Ao assinar, o cliente concorda com os serviços e
								peças listados.
							</p>
						</div>
					</div>
				</form>

				{/* Rodapé Fixo */}
				<div className="p-4 border-t border-app-border bg-black/5 dark:bg-white/5 shrink-0">
					{/* Flex-col no mobile (botões empilhados), Flex-row no desktop */}
					<div className="flex flex-col sm:flex-row justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors order-2 sm:order-1"
						>
							Voltar
						</button>
						<button
							type="submit"
							form="finish-os-form"
							disabled={isSubmitting}
							className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 shadow-sm order-1 sm:order-2 flex justify-center items-center"
						>
							{isSubmitting
								? "Lacrando O.S..."
								: "Concluir e Lacrar Serviço"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
