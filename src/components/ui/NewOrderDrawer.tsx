import { X } from "lucide-react";

interface NewOrderDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

// Mocks simulando o retorno da sua API (rotas de buscar clientes e equipamentos)
const mockClients = [
	{ id: "123e4567-e89b-12d3-a456-426614174000", name: "Hospital São Luiz" },
	{ id: "123e4567-e89b-12d3-a456-426614174001", name: "Lab. São Marcos" },
];

const mockEquipments = [
	{
		id: "987e6543-e21b-34d5-c678-426614174000",
		name: "Analisador Bioquímico (SN: BX-992)",
	},
	{
		id: "987e6543-e21b-34d5-c678-426614174001",
		name: "Centrífuga de Bancada (SN: CT-004)",
	},
];

export function NewOrderDrawer({ isOpen, onClose }: NewOrderDrawerProps) {
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
						<h2 className="text-lg font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
							Nova Ordem de Serviço
						</h2>
						<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors duration-300">
							Preencha os dados para iniciar o atendimento.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-5">
					<div className="space-y-4">
						{/* Select de Cliente mapeando para customerId */}
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 transition-colors">
								Cliente / Laboratório
							</label>
							<select className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors appearance-none cursor-pointer">
								<option value="" disabled selected>
									Selecione um cliente...
								</option>
								{mockClients.map((client) => (
									<option key={client.id} value={client.id}>
										{client.name}
									</option>
								))}
							</select>
						</div>

						{/* Select de Equipamento mapeando para equipmentId */}
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 transition-colors">
								Equipamento
							</label>
							<select className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors appearance-none cursor-pointer">
								<option value="" disabled selected>
									Selecione um equipamento...
								</option>
								{mockEquipments.map((eq) => (
									<option key={eq.id} value={eq.id}>
										{eq.name}
									</option>
								))}
							</select>
						</div>

						{/* Select de Tipo mapeando para o enum do Zod */}
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 transition-colors">
								Tipo de Atendimento
							</label>
							<select className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors appearance-none cursor-pointer">
								<option value="" disabled selected>
									Selecione o tipo...
								</option>
								<option value="INSTALACAO">Instalação</option>
								<option value="PREVENTIVA">Preventiva</option>
								<option value="CORRETIVA">Corretiva</option>
							</select>
						</div>

						{/* Textarea mapeando para problem_description com limites do Zod */}
						<div>
							<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5 transition-colors">
								Relato do Problema
							</label>
							<textarea
								rows={4}
								minLength={5}
								maxLength={255}
								placeholder="Descreva a falha (mínimo de 5 caracteres)..."
								className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light placeholder-dwl-blue/40 dark:placeholder-dwl-grey focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors resize-none"
							/>
							<p className="text-xs text-dwl-blue/50 dark:text-dwl-grey mt-1">
								Máximo de 255 caracteres.
							</p>
						</div>
					</div>
				</div>

				<div className="p-6 border-t border-app-border flex justify-end gap-3 bg-black/5 dark:bg-white/5 transition-colors duration-300">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg text-sm font-medium text-dwl-blue dark:text-dwl-light hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
					>
						Cancelar
					</button>
					<button className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 transition-colors shadow-sm">
						Criar O.S.
					</button>
				</div>
			</div>
		</>
	);
}
