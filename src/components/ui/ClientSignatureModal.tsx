import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X, PenLine, Eraser } from "lucide-react";

interface ClientSignatureModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (signatureBase64: string) => Promise<void>;
}

export function ClientSignatureModal({
	isOpen,
	onClose,
	onConfirm,
}: ClientSignatureModalProps) {
	const sigCanvas = useRef<SignatureCanvas>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleClear = () => {
		sigCanvas.current?.clear();
	};

	const handleConfirm = async () => {
		if (sigCanvas.current?.isEmpty()) {
			alert("Por favor, colete a assinatura do cliente antes de salvar.");
			return;
		}

		setIsSubmitting(true);
		// Exporta o desenho como PNG em Base64
		const base64 = sigCanvas.current
			?.getTrimmedCanvas()
			.toDataURL("image/png");

		if (base64) {
			await onConfirm(base64);
		}
		setIsSubmitting(false);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-lg overflow-hidden">
				{/* Cabeçalho */}
				<div className="flex items-center justify-between p-4 border-b border-app-border bg-dwl-teal/10">
					<div className="flex items-center gap-2 text-dwl-teal">
						<PenLine className="w-5 h-5" />
						<h3 className="font-bold">Assinatura do Cliente</h3>
					</div>
					<button
						onClick={onClose}
						className="text-dwl-blue/50 hover:text-dwl-blue dark:text-dwl-grey dark:hover:text-dwl-light transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="p-6">
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mb-4 text-center">
						Solicite que o cliente assine no quadro abaixo para
						concordância com o serviço executado.
					</p>

					{/* Container do Canvas */}
					<div className="border-2 border-dashed border-app-border rounded-lg overflow-hidden bg-white">
						<SignatureCanvas
							ref={sigCanvas}
							penColor="black"
							canvasProps={{
								className: "w-full h-48 cursor-crosshair",
							}}
							backgroundColor="rgba(255, 255, 255, 1)" // Garante o fundo branco no Base64
						/>
					</div>

					<div className="flex justify-between mt-6">
						<button
							type="button"
							onClick={handleClear}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
						>
							<Eraser className="w-4 h-4" />
							Limpar
						</button>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleConfirm}
								disabled={isSubmitting}
								className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 disabled:opacity-50 transition-colors shadow-sm min-w-[120px]"
							>
								{isSubmitting
									? "Salvando..."
									: "Salvar Assinatura"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
