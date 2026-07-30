import { DataTable } from "../components/ui/DataTable";

export function Orders() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					Ordens de Serviço
				</h1>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey transition-colors duration-300 mt-1">
					Gerencie as O.S., acompanhe o status e atualize os chamados
					técnicos.
				</p>
			</div>

			{/* Nossa nova DataTable gerencial */}
			<DataTable />
		</div>
	);
}
