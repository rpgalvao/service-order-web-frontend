import { useState, useEffect, useCallback, useMemo } from "react";
import {
	Plus,
	Search,
	ClipboardList,
	Wrench,
	Settings,
	ShieldCheck,
	AlertCircle,
	MoreHorizontal,
	Eye,
	Mail,
	X,
	Send,
	Filter,
} from "lucide-react";
import {
	serviceOrderService,
	type ServiceOrder,
} from "../services/serviceOrderService";
import { NewServiceOrderDrawer } from "../components/ui/NewServiceOrderDrawer";
import { useNavigate, useSearchParams } from "react-router-dom"; // 🟢 NOVO IMPORT

export function Orders() {
	const navigate = useNavigate();

	// 🟢 O NOVO CORAÇÃO DOS FILTROS
	const [searchParams, setSearchParams] = useSearchParams();
	const statusFilter = searchParams.get("status") || "TODOS";
	const techFilter = searchParams.get("tech") || "TODOS";

	const [orders, setOrders] = useState<ServiceOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [emailModalOs, setEmailModalOs] = useState<ServiceOrder | null>(null);
	const [customEmail, setCustomEmail] = useState("");
	const [isSendingEmail, setIsSendingEmail] = useState(false);

	const loadOrders = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await serviceOrderService.getOrders();
			setOrders(data);
		} catch (error) {
			console.error("Erro ao buscar as Ordens de Serviço:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadOrders();
	}, [loadOrders]);

	// 🟢 EXTRAIR TÉCNICOS DINAMICAMENTE
	const availableTechnicians = useMemo(() => {
		const techs = orders
			.filter((os) => os.status === "FINALIZADA" && os.closedBy?.name)
			.map((os) => os.closedBy!.name);
		return Array.from(new Set(techs)).sort();
	}, [orders]);

	// 🟢 ATUALIZAR A URL AO TROCAR FILTROS
	const handleFilterChange = (key: string, value: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (value === "TODOS" || !value) {
			newParams.delete(key);
		} else {
			newParams.set(key, value);
		}
		setSearchParams(newParams);
	};

	// 🟢 APLICAR TODOS OS FILTROS AO MESMO TEMPO
	const filteredOrders = orders.filter((os) => {
		// 1. Busca por Texto
		const term = searchTerm.toLowerCase();
		const osNumber = os.number ? os.number.toString() : "";
		const customerName = os.customer?.name.toLowerCase() || "";
		const serialNumber = os.equipment?.serial_number.toLowerCase() || "";
		const matchesText =
			osNumber.includes(term) ||
			customerName.includes(term) ||
			serialNumber.includes(term);

		// 2. Filtro de Status
		const matchesStatus =
			statusFilter === "TODOS" || os.status === statusFilter;

		// 3. Filtro de Técnico
		const matchesTech =
			techFilter === "TODOS" ||
			(os.status === "FINALIZADA" && os.closedBy?.name === techFilter);

		return matchesText && matchesStatus && matchesTech;
	});

	const handleSendEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!emailModalOs) return;
		setIsSendingEmail(true);

		try {
			const response = await serviceOrderService.sendEmail(
				emailModalOs.id,
				customEmail,
			);
			alert(response.message || "E-mail enviado com sucesso!");
			setEmailModalOs(null);
			setCustomEmail("");
		} catch (error: any) {
			alert(error.response?.data?.message || "Erro ao enviar o e-mail.");
		} finally {
			setIsSendingEmail(false);
		}
	};

	const openEmailModal = (os: ServiceOrder, e: React.MouseEvent) => {
		e.stopPropagation();
		setEmailModalOs(os);
		setCustomEmail(os.customer?.email || "");
		setOpenMenuId(null);
	};

	const renderTypeIcon = (type: string) => {
		switch (type) {
			case "CORRETIVA":
				return (
					<span title="Corretiva">
						<Wrench className="w-4 h-4 text-red-500" />
					</span>
				);
			case "PREVENTIVA":
				return (
					<span title="Preventiva">
						<ShieldCheck className="w-4 h-4 text-blue-500" />
					</span>
				);
			case "INSTALACAO":
				return (
					<span title="Instalação">
						<Settings className="w-4 h-4 text-emerald-500" />
					</span>
				);
			default:
				return null;
		}
	};

	const renderStatusBadge = (status: string) => {
		switch (status) {
			case "ABERTA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
						Aberta
					</span>
				);
			case "FINALIZADA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
						Finalizada
					</span>
				);
			case "CANCELADA":
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
						Cancelada
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20">
						{status}
					</span>
				);
		}
	};

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors">
						Ordens de Serviço
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1 transition-colors">
						Acompanhe e gerencie as manutenções da oficina.
					</p>
				</div>
				<button
					onClick={() => setIsDrawerOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" /> Nova O.S.
				</button>
			</div>

			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-visible transition-colors duration-300">
				{/* 🟢 BARRA DE FILTROS SUPER LIMPA */}
				<div className="p-4 border-b border-app-border flex flex-col md:flex-row gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dwl-blue/40 dark:text-dwl-grey" />
						<input
							type="text"
							placeholder="Buscar por Nº, Cliente ou S/N..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all text-sm"
						/>
					</div>

					<div className="flex gap-3 flex-col sm:flex-row">
						<div className="relative">
							<Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dwl-blue/40 dark:text-dwl-grey" />
							<select
								value={statusFilter}
								onChange={(e) =>
									handleFilterChange("status", e.target.value)
								}
								className="w-full sm:w-[160px] pl-9 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all text-sm appearance-none cursor-pointer"
							>
								<option value="TODOS">Todos os Status</option>
								<option value="ABERTA">Aberta</option>
								<option value="FINALIZADA">Finalizada</option>
								<option value="CANCELADA">Cancelada</option>
							</select>
						</div>

						<div className="relative">
							<Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dwl-blue/40 dark:text-dwl-grey" />
							<select
								value={techFilter}
								onChange={(e) =>
									handleFilterChange("tech", e.target.value)
								}
								disabled={availableTechnicians.length === 0}
								className="w-full sm:w-[180px] pl-9 pr-4 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue dark:text-dwl-light focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-all text-sm appearance-none cursor-pointer disabled:opacity-50"
							>
								<option value="TODOS">Todos os Técnicos</option>
								{availableTechnicians.map((tech) => (
									<option key={tech} value={tech}>
										{tech}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse min-w-[900px]">
						<thead>
							<tr className="border-b border-app-border bg-black/5 dark:bg-white/5 transition-colors">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									O.S.
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Cliente / Equipamento
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Problema Relatado
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light">
									Abertura
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
										colSpan={6}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										<div className="flex flex-col items-center justify-center">
											<div className="w-8 h-8 border-4 border-dwl-teal border-t-transparent rounded-full animate-spin mb-4" />
											<p>
												Carregando ordens de serviço...
											</p>
										</div>
									</td>
								</tr>
							) : filteredOrders.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-dwl-blue/50 dark:text-dwl-grey"
									>
										<div className="flex flex-col items-center justify-center gap-2">
											<ClipboardList className="w-8 h-8 opacity-50" />
											<p>
												Nenhuma ordem de serviço
												encontrada com os filtros
												atuais.
											</p>
										</div>
									</td>
								</tr>
							) : (
								filteredOrders.map((os) => (
									<tr
										key={os.id}
										onClick={() =>
											navigate(`/ordens/${os.id}`)
										}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer relative"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												{renderTypeIcon(os.type)}
												<span className="font-bold text-dwl-blue dark:text-dwl-light">
													#
													{String(os.number).padStart(
														4,
														"0",
													)}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div>
												<p className="text-sm font-medium text-dwl-blue dark:text-dwl-light truncate max-w-[200px]">
													{os.customer?.name ||
														"Sem Cliente"}
												</p>
												<p className="text-xs text-dwl-blue/60 dark:text-dwl-grey mt-0.5 truncate max-w-[200px]">
													S/N:{" "}
													{
														os.equipment
															?.serial_number
													}{" "}
													{os.equipment?.model?.name
														? `- ${os.equipment.model.name}`
														: ""}
												</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-start gap-2 max-w-xs">
												<AlertCircle className="w-4 h-4 text-dwl-teal shrink-0 mt-0.5" />
												<p className="text-sm text-dwl-blue/80 dark:text-dwl-light truncate">
													{os.problem_description}
												</p>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey whitespace-nowrap">
											{os.opened_at
												? new Date(
														os.opened_at,
													).toLocaleDateString(
														"pt-BR",
														{
															day: "2-digit",
															month: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)
												: "Indisponível"}
										</td>
										<td className="px-6 py-4 text-center">
											{renderStatusBadge(os.status)}
											{/* 🟢 Mostra qual técnico fez a O.S. (Opcional, bom para o contexto) */}
											{os.status === "FINALIZADA" &&
												os.closedBy?.name && (
													<div className="text-[10px] text-dwl-blue/50 dark:text-dwl-grey mt-1">
														{
															os.closedBy.name.split(
																" ",
															)[0]
														}
													</div>
												)}
										</td>
										<td
											className="px-6 py-4 text-center"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="relative inline-block text-left">
												<button
													onClick={() =>
														setOpenMenuId(
															openMenuId === os.id
																? null
																: os.id,
														)
													}
													className="p-2 text-dwl-blue/50 hover:text-dwl-teal dark:text-dwl-grey dark:hover:text-dwl-teal transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
												>
													<MoreHorizontal className="w-5 h-5" />
												</button>

												{openMenuId === os.id && (
													<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-app-darkSurface ring-1 ring-black ring-opacity-5 border border-app-border z-50 overflow-hidden">
														<div
															className="py-1"
															role="menu"
														>
															<button
																onClick={() =>
																	navigate(
																		`/ordens/${os.id}`,
																	)
																}
																className="w-full text-left px-4 py-2 text-sm text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
															>
																<Eye className="w-4 h-4 text-dwl-teal" />{" "}
																Ver Detalhes
															</button>
															<button
																onClick={(e) =>
																	openEmailModal(
																		os,
																		e,
																	)
																}
																disabled={
																	os.status !==
																	"FINALIZADA"
																}
																className="w-full text-left px-4 py-2 text-sm text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
															>
																<Mail className="w-4 h-4 text-dwl-teal" />{" "}
																Enviar por
																E-mail
															</button>
														</div>
													</div>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<NewServiceOrderDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadOrders}
			/>

			{emailModalOs && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-2xl w-full max-w-md overflow-hidden">
						<div className="flex items-center justify-between p-4 border-b border-app-border">
							<div className="flex items-center gap-2 text-dwl-teal">
								<Mail className="w-5 h-5" />
								<h3 className="font-bold text-dwl-blue dark:text-dwl-light">
									Enviar O.S. #
									{String(emailModalOs.number).padStart(
										4,
										"0",
									)}
								</h3>
							</div>
							<button
								onClick={() => setEmailModalOs(null)}
								className="text-dwl-blue/50 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<form
							onSubmit={handleSendEmail}
							className="p-6 space-y-4"
						>
							<div>
								<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
									E-mail de Destino{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									required
									type="email"
									value={customEmail}
									onChange={(e) =>
										setCustomEmail(e.target.value)
									}
									className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent focus:ring-1 focus:ring-dwl-teal text-dwl-blue dark:text-dwl-light"
								/>
							</div>
							<div className="flex justify-end gap-3 pt-4">
								<button
									type="button"
									onClick={() => setEmailModalOs(null)}
									className="px-4 py-2 rounded-lg text-sm font-medium text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={isSendingEmail || !customEmail}
									className="px-4 py-2 rounded-lg text-sm font-medium bg-dwl-teal text-white hover:bg-dwl-teal/90 disabled:opacity-50 flex items-center gap-2"
								>
									{isSendingEmail ? (
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									) : (
										<>
											<Send className="w-4 h-4" /> Enviar
											PDF
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
