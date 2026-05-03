import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
	ArrowLeft,
	PlusCircle,
	Search,
	Edit,
	MonitorSmartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function Equipments() {
	const navigate = useNavigate();

	const [equipments, setEquipments] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = "Equipamentos | DWL Tech Support";

		async function loadEquipments() {
			try {
				// Busca a lista lá no seu equipment.controller.ts
				const response = await api.get("/equipment");
				if (response.data.success) {
					setEquipments(response.data.data);
				}
			} catch (error) {
				console.error("Erro ao carregar equipamentos:", error);
				toast.error("Erro ao carregar a lista de equipamentos.");
			} finally {
				setLoading(false);
			}
		}

		loadEquipments();
	}, []);

	// Filtro inteligente: busca pela descrição do aparelho ou pelo Número de Série
	const filteredEquipments = equipments.filter((eq) => {
		const searchLower = search.toLowerCase();
		const desc = eq.description?.toLowerCase() || "";
		const serial = eq.serial_number?.toLowerCase() || "";
		return desc.includes(searchLower) || serial.includes(searchLower);
	});

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* HEADER */}
			<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
				<div className="flex items-center gap-3 sm:gap-4">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-7 sm:h-8 w-auto opacity-90"
					/>
					<div className="h-6 w-px bg-slate-200" />
					<button
						onClick={() => navigate("/dashboard")}
						className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
					>
						<ArrowLeft size={20} className="mt-0.5" />
						<span className="text-sm sm:text-base">Painel</span>
					</button>
				</div>
				<h1 className="flex items-center gap-2 text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
					<MonitorSmartphone size={20} />
					Meus Equipamentos
				</h1>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
				{/* BARRA DE AÇÕES */}
				<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="relative w-full sm:max-w-md">
						<input
							type="text"
							placeholder="Buscar por descrição ou S/N..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 pl-10 text-sm focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue shadow-sm"
						/>
						<Search
							className="absolute left-3 top-3 text-slate-400"
							size={18}
						/>
					</div>

					<button
						onClick={() => navigate("/equipamentos/novo")}
						className="flex items-center justify-center gap-2 rounded-lg bg-dwl-blue px-6 py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 shadow-sm whitespace-nowrap"
					>
						<PlusCircle size={20} />
						Novo Equipamento
					</button>
				</div>

				{/* TABELA DE EQUIPAMENTOS */}
				<div className="bg-white rounded-xl border border-dwl-border/30 shadow-sm overflow-hidden">
					{loading ? (
						<div className="py-12 text-center font-bold text-dwl-blue animate-pulse">
							Carregando parque de máquinas...
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
								<thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
									<tr>
										<th className="px-6 py-4">
											Equipamento
										</th>
										<th className="px-6 py-4">
											Número de Série
										</th>
										<th className="px-6 py-4">
											Cliente (Dono)
										</th>
										<th className="px-6 py-4 text-center">
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-dwl-border/30">
									{filteredEquipments.length === 0 ? (
										<tr>
											<td
												colSpan={4}
												className="px-6 py-8 text-center text-slate-500 italic"
											>
												Nenhum equipamento encontrado.
											</td>
										</tr>
									) : (
										filteredEquipments.map((eq) => (
											<tr
												key={eq.id}
												className="hover:bg-slate-50 transition-colors"
											>
												<td className="px-6 py-4 font-bold text-slate-800">
													{eq.description}
												</td>
												<td className="px-6 py-4 font-mono text-dwl-blue">
													{eq.serial_number}
												</td>
												<td className="px-6 py-4">
													{eq.customer?.name ||
														"Sem vínculo"}
												</td>
												<td className="px-6 py-4 text-center">
													<button
														onClick={() =>
															navigate(
																`/equipamentos/editar/${eq.id}`,
															)
														}
														className="p-2 text-slate-400 hover:text-dwl-teal transition-colors rounded-lg hover:bg-slate-100 inline-flex"
														title="Editar Equipamento"
													>
														<Edit size={18} />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
