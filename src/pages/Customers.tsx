import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MapPin, Building2, Mail, Edit2 } from "lucide-react";
import { customerService, type Customer } from "../services/customerService";
import { formatPhone } from "../utils/formatters";
import { CustomerDrawer } from "../components/ui/CustomerDrawer";

export function Customers() {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Novos estados de controle da gaveta
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

	const loadCustomers = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await customerService.getCustomers();
			setCustomers(data);
		} catch (error) {
			console.error("Erro ao buscar a lista de clientes:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCustomers();
	}, [loadCustomers]);

	const filteredCustomers = customers.filter(
		(customer) =>
			customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(customer.email &&
				customer.email
					.toLowerCase()
					.includes(searchTerm.toLowerCase())),
	);

	// Função que prepara o ambiente para um NOVO cliente
	const handleNewCustomer = () => {
		setCustomerToEdit(null);
		setIsDrawerOpen(true);
	};

	// Função que prepara o ambiente para EDITAR um cliente
	const handleEditCustomer = (customer: Customer) => {
		setCustomerToEdit(customer);
		setIsDrawerOpen(true);
	};

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
						Clientes
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
						Gerencie as empresas e clínicas parceiras da oficina.
					</p>
				</div>

				<button
					onClick={handleNewCustomer}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" />
					Novo Cliente
				</button>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				<div className="p-4 border-b border-app-border">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dwl-blue/40 dark:text-dwl-grey" />
						<input
							type="text"
							placeholder="Buscar por nome ou e-mail..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse min-w-[800px]">
						<thead>
							<tr className="border-b border-app-border bg-black/5 dark:bg-white/5 transition-colors">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Cliente
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Localização
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Contato
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-center">
									Status
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light text-center">
									Ações
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-app-border">
							{isLoading ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center"
									>
										<div className="flex flex-col items-center justify-center text-dwl-blue/50 dark:text-dwl-grey">
											<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
											<p>Carregando clientes...</p>
										</div>
									</td>
								</tr>
							) : filteredCustomers.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										Nenhum cliente encontrado.
									</td>
								</tr>
							) : (
								filteredCustomers.map((customer) => (
									<tr
										key={customer.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-dwl-teal/10 flex items-center justify-center text-dwl-teal">
													<Building2 className="w-5 h-5" />
												</div>
												<div>
													<p className="text-sm font-medium text-dwl-blue dark:text-dwl-light">
														{customer.name}
													</p>
													<div className="flex items-center gap-1 mt-0.5 text-xs text-dwl-blue/60 dark:text-dwl-grey">
														<Mail className="w-3 h-3" />
														{customer.email ||
															"Sem e-mail"}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2 text-sm text-dwl-blue/70 dark:text-dwl-grey">
												<MapPin className="w-4 h-4 shrink-0" />
												<span className="truncate max-w-[200px]">
													{customer.city} -{" "}
													{customer.state}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey whitespace-nowrap">
											{customer.phone
												? formatPhone(customer.phone)
												: "-"}
										</td>
										<td className="px-6 py-4 text-center">
											<span
												className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
													customer.active
														? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
														: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
												}`}
											>
												{customer.active
													? "Ativo"
													: "Inativo"}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<button
												onClick={() =>
													handleEditCustomer(customer)
												}
												className="p-2 text-dwl-blue/50 dark:text-dwl-grey hover:text-dwl-teal dark:hover:text-dwl-teal hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
												title="Editar Cliente"
											>
												<Edit2 className="w-4 h-4" />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<CustomerDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadCustomers}
				customerToEdit={customerToEdit}
			/>
		</div>
	);
}
