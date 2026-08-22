import { useState, useEffect, type FormEvent } from "react";
import { FileSignature, X } from "lucide-react";
import { checklistTemplateService } from "../../services/checklistTemplateService";
import {
	equipmentModelService,
	type EquipmentModel,
} from "../../services/equipmentModelService";

interface NewChecklistModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function NewChecklistModal({
	isOpen,
	onClose,
	onSuccess,
}: NewChecklistModalProps) {
	const [name, setName] = useState("");
	const [modelId, setModelId] = useState("");
	const [models, setModels] = useState<EquipmentModel[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			equipmentModelService
				.getModels()
				.then((data) => setModels(data.filter((m) => m.active)));
		} else {
			setName("");
			setModelId("");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await checklistTemplateService.createTemplate({ name, modelId });
			onSuccess();
			onClose();
		} catch (err) {
			alert("Erro ao criar o gabarito. Verifique os dados.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-md overflow-hidden">
				<div className="flex items-center justify-between p-4 border-b border-app-border">
					<div className="flex items-center gap-2 text-dwl-teal">
						<FileSignature className="w-5 h-5" />
						<h3 className="font-bold text-dwl-blue dark:text-dwl-light">
							Novo Checklist
						</h3>
					</div>
					<button
						onClick={onClose}
						className="text-dwl-blue/50 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
							Nome do Gabarito{" "}
							<span className="text-red-500">*</span>
						</label>
						<input
							required
							minLength={3}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ex: Preventiva Padrão"
							className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal text-dwl-blue dark:text-dwl-light"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
							Modelo do Equipamento{" "}
							<span className="text-red-500">*</span>
						</label>
						<select
							required
							value={modelId}
							onChange={(e) => setModelId(e.target.value)}
							className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal text-dwl-blue dark:text-dwl-light [&>option]:bg-app-lightSurface dark:[&>option]:bg-app-darkSurface"
						>
							<option value="">Selecione o modelo base...</option>
							{models.map((model) => (
								<option key={model.id} value={model.id}>
									{model.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg text-sm font-medium text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !modelId}
							className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 disabled:opacity-50"
						>
							{isSubmitting ? "Salvando..." : "Criar Checklist"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
