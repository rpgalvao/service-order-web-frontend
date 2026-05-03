import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import {
	ArrowLeft,
	Save,
	FileText,
	Wrench,
	User,
	MonitorSmartphone,
	CalendarClock,
	AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import logoDwl from "../assets/logo_dwl.png";

export default function OSDetails() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [osData, setOsData] = useState<any>(null);

	// Campos Editáveis
	const [status, setStatus] = useState("");
	const [solution, setSolution] = useState("");
	const [cancellationReason, setCancellationReason] = useState("");

	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		document.title = "Detalhes da O.S. | DWL Tech Support";

		async function loadOS() {
			try {
				const response = await api.get(`/serviceorder/${id}`);
				if (response.data.success) {
					const data = response.data.data;
					setOsData(data);
					setStatus(data.status);
					setSolution(data.solution_description || "");
					setCancellationReason(data.cancellation_reason || "");
				}
			} catch (error) {
				toast.error("Erro ao carregar a Ordem de Serviço.");
				navigate("/dashboard");
			} finally {
				setPageLoading(false);
			}
		}

		loadOS();
	}, [id, navigate]);

	const handleUpdateOS = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.put(`/serviceorder/${id}`, {
				status,
				solution_description: solution,
				cancellation_reason:
					status === "CANCELADA" ? cancellationReason : undefined,
			});

			toast.success("Ordem de Serviço atualizada!", { icon: "✅" });
			setOsData({
				...osData,
				status,
				solution_description: solution,
				cancellation_reason: cancellationReason,
			});
		} catch (error: any) {
			const backendMessage = error.response?.data?.message;
			toast.error(backendMessage || "Erro ao atualizar a O.S.");
		} finally {
			setLoading(false);
		}
	};

	// 🏆 O PULO DO GATO DA IMPRESSÃO!
	const handleGeneratePDF = () => {
		window.print();
	};

	if (pageLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-dwl-bg">
				<div className="text-xl font-bold text-dwl-blue animate-pulse">
					Carregando O.S...
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg print:bg-white">
			{/* ========================================== */}
			{/* TELA DO SISTEMA (ESCONDIDA NA IMPRESSÃO)   */}
			{/* ========================================== */}
			<div className="print:hidden flex flex-col min-h-screen">
				{/* HEADER */}
				<header className="flex h-16 items-center justify-between bg-white border-b border-dwl-border/30 px-4 sm:px-6 shadow-sm">
					<div className="flex items-center gap-3 sm:gap-4">
						<img
							src={logoDwl}
							alt="DWL Logo"
							className="h-7 sm:h-8 w-auto opacity-90"
						/>
						<div className="h-6 w-[1px] bg-slate-200" />
						<button
							onClick={() => navigate("/dashboard")}
							className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-dwl-blue"
						>
							<ArrowLeft size={20} className="mt-0.5" />
							<span className="text-sm sm:text-base">Painel</span>
						</button>
					</div>
					<div className="flex items-center gap-4">
						<button
							onClick={handleGeneratePDF}
							className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-dwl-blue transition-colors"
						>
							<FileText size={18} /> Gerar PDF
						</button>
						<h1 className="text-sm sm:text-lg font-extrabold text-dwl-teal truncate">
							O.S. #{osData?.number}
						</h1>
					</div>
				</header>

				<main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-8 space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* COLUNA ESQUERDA: Informações */}
						<div className="lg:col-span-1 space-y-6">
							{/* Card Cliente */}
							<div className="rounded-xl border border-dwl-border/30 bg-white p-5 shadow-sm">
								<h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
									<User size={18} className="text-dwl-blue" />{" "}
									Cliente
								</h3>
								<div className="space-y-1">
									<p className="font-semibold text-slate-700">
										{osData?.customer?.name}
									</p>
									<p className="text-sm text-slate-500">
										{osData?.customer?.phone ||
											"Sem telefone"}
									</p>
									<p className="text-sm text-slate-500">
										{osData?.customer?.city} -{" "}
										{osData?.customer?.state}
									</p>
								</div>
							</div>

							{/* Card Equipamento */}
							<div className="rounded-xl border border-dwl-border/30 bg-white p-5 shadow-sm">
								<h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
									<MonitorSmartphone
										size={18}
										className="text-dwl-blue"
									/>{" "}
									Equipamento
								</h3>
								<div className="space-y-1">
									<p className="font-semibold text-slate-700">
										{osData?.equipment?.description}
									</p>
									<p className="text-sm font-mono text-slate-500">
										S/N: {osData?.equipment?.serial_number}
									</p>
								</div>
							</div>

							{/* Card Datas */}
							<div className="rounded-xl border border-dwl-border/30 bg-white p-5 shadow-sm">
								<h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
									<CalendarClock
										size={18}
										className="text-dwl-blue"
									/>{" "}
									Datas
								</h3>
								<div className="space-y-2">
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase">
											Entrada
										</p>
										<p className="text-sm font-medium text-slate-700">
											{new Date(
												osData?.opened_at,
											).toLocaleDateString("pt-BR")}{" "}
											às{" "}
											{new Date(
												osData?.opened_at,
											).toLocaleTimeString("pt-BR", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
									{osData?.closed_at && (
										<div className="pt-2">
											<p className="text-xs font-semibold text-slate-400 uppercase">
												Fechamento
											</p>
											<p className="text-sm font-medium text-dwl-teal">
												{new Date(
													osData?.closed_at,
												).toLocaleDateString(
													"pt-BR",
												)}{" "}
												às{" "}
												{new Date(
													osData?.closed_at,
												).toLocaleTimeString("pt-BR", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* COLUNA DIREITA: Área de Trabalho */}
						<div className="lg:col-span-2 space-y-6">
							<form
								onSubmit={handleUpdateOS}
								className="rounded-xl border border-dwl-border/30 bg-white p-6 sm:p-8 shadow-sm flex flex-col h-full"
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
									<h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
										<Wrench
											size={22}
											className="text-dwl-teal"
										/>{" "}
										Diagnóstico e Solução
									</h2>
									<div className="flex items-center gap-2">
										<label className="text-sm font-semibold text-slate-600">
											Status:
										</label>
										<select
											value={status}
											onChange={(e) =>
												setStatus(e.target.value)
											}
											className={`rounded-lg border border-dwl-border/50 bg-white p-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-dwl-blue
												${status === "ABERTA" ? "text-amber-600" : ""}
												${status === "FINALIZADA" ? "text-dwl-teal" : ""}
												${status === "CANCELADA" ? "text-dwl-red" : ""}
											`}
										>
											<option
												value="ABERTA"
												className="text-amber-600"
											>
												ABERTA
											</option>
											<option
												value="FINALIZADA"
												className="text-dwl-teal"
											>
												FINALIZADA
											</option>
											<option
												value="CANCELADA"
												className="text-dwl-red"
											>
												CANCELADA
											</option>
										</select>
									</div>
								</div>

								<div className="space-y-6 flex-1">
									<div>
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											Defeito Relatado pelo Cliente
										</label>
										<div className="w-full rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-wrap">
											{osData?.problem_description}
										</div>
									</div>

									<div className="flex-1 flex flex-col">
										<label className="mb-1.5 block text-sm font-semibold text-slate-700">
											Solução / Serviço Realizado
										</label>
										<textarea
											rows={5}
											placeholder="Descreva detalhadamente o serviço executado..."
											value={solution}
											onChange={(e) =>
												setSolution(e.target.value)
											}
											className="w-full flex-1 resize-y rounded-lg border border-dwl-border/50 bg-white p-4 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
										/>
									</div>

									{status === "CANCELADA" && (
										<div className="animate-in fade-in slide-in-from-top-2 duration-300">
											<label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-dwl-red">
												<AlertTriangle size={16} />{" "}
												Motivo do Cancelamento
											</label>
											<textarea
												rows={3}
												required
												placeholder="Por que esta O.S. está sendo cancelada?"
												value={cancellationReason}
												onChange={(e) =>
													setCancellationReason(
														e.target.value,
													)
												}
												className="w-full resize-y rounded-lg border border-dwl-red/30 bg-red-50 p-4 text-base sm:text-sm text-slate-900 placeholder-red-300 focus:border-dwl-red focus:outline-none focus:ring-1 focus:ring-dwl-red"
											/>
										</div>
									)}
								</div>

								<div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-slate-100 gap-4">
									<button
										type="button"
										onClick={handleGeneratePDF}
										className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 hover:bg-slate-50 active:scale-95 sm:hidden"
									>
										<FileText size={20} /> Gerar PDF
									</button>
									<button
										type="submit"
										disabled={loading}
										className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-dwl-blue px-10 py-3 font-bold text-white transition-all hover:bg-dwl-teal active:scale-95 disabled:opacity-70 sm:ml-auto"
									>
										<Save size={20} />
										{loading
											? "Salvando..."
											: "Salvar Atualizações"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</main>
			</div>

			{/* ========================================== */}
			{/* FORMATO DO PDF (INVISÍVEL NA TELA NORMAL)  */}
			{/* ========================================== */}
			<div className="hidden print:block w-full p-8 font-sans text-slate-900 bg-white">
				{/* Cabeçalho da OS */}
				<div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
					<img
						src={logoDwl}
						alt="DWL Logo"
						className="h-16 object-contain"
					/>
					<div className="text-right">
						<h1 className="text-3xl font-extrabold uppercase tracking-widest text-slate-800">
							Ordem de Serviço
						</h1>
						<p className="text-2xl font-bold text-slate-500 mt-1">
							Nº {osData?.number}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-8 mb-8">
					{/* Dados do Cliente */}
					<div className="border border-slate-300 rounded-lg p-5">
						<h3 className="font-bold text-sm uppercase text-slate-500 mb-3 border-b border-slate-200 pb-2">
							Dados do Cliente
						</h3>
						<p className="font-bold text-lg">
							{osData?.customer?.name}
						</p>
						<p className="text-slate-700">
							Telefone:{" "}
							{osData?.customer?.phone || "Não informado"}
						</p>
						<p className="text-slate-700">
							E-mail: {osData?.customer?.email || "Não informado"}
						</p>
						<p className="text-slate-700">
							{osData?.customer?.city} - {osData?.customer?.state}
						</p>
					</div>

					{/* Dados do Equipamento */}
					<div className="border border-slate-300 rounded-lg p-5">
						<h3 className="font-bold text-sm uppercase text-slate-500 mb-3 border-b border-slate-200 pb-2">
							Equipamento
						</h3>
						<p className="font-bold text-lg">
							{osData?.equipment?.description}
						</p>
						<p className="text-slate-700">
							S/N:{" "}
							<span className="font-mono">
								{osData?.equipment?.serial_number}
							</span>
						</p>

						<div className="mt-3 text-sm space-y-1">
							<p className="text-slate-700">
								<strong>Status:</strong>{" "}
								{osData?.status === "ABERTA"
									? "Em andamento"
									: osData?.status}
							</p>
							<p className="text-slate-700">
								<strong>Finalização:</strong>{" "}
								{osData?.closed_at ? (
									new Date(
										osData?.closed_at,
									).toLocaleDateString("pt-BR")
								) : (
									<span className="italic text-slate-400">
										Aguardando conclusão
									</span>
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Descrição do Problema */}
				<div className="border border-slate-300 rounded-lg p-5 mb-8">
					<h3 className="font-bold text-sm uppercase text-slate-500 mb-3 border-b border-slate-200 pb-2">
						Defeito Relatado
					</h3>
					<p className="text-slate-800 whitespace-pre-wrap">
						{osData?.problem_description}
					</p>
				</div>

				{/* Solução (Se houver) */}
				{(osData?.solution_description ||
					osData?.cancellation_reason) && (
					<div className="border border-slate-300 rounded-lg p-5 mb-8">
						<h3 className="font-bold text-sm uppercase text-slate-500 mb-3 border-b border-slate-200 pb-2">
							{osData?.status === "CANCELADA"
								? "Motivo do Cancelamento"
								: "Serviço Realizado"}
						</h3>
						<p className="text-slate-800 whitespace-pre-wrap">
							{osData?.status === "CANCELADA"
								? osData?.cancellation_reason
								: osData?.solution_description}
						</p>
					</div>
				)}

				{/* Assinaturas */}
				<div className="mt-24 grid grid-cols-2 gap-16 px-10">
					<div className="text-center">
						<div className="border-t-2 border-slate-800 pt-2 font-bold text-sm">
							Assinatura do Cliente
						</div>
						<p className="text-xs text-slate-500 mt-1">
							Declaro estar ciente e de acordo.
						</p>
					</div>
					<div className="text-center">
						<div className="border-t-2 border-slate-800 pt-2 font-bold text-sm">
							Técnico Responsável
						</div>
						<p className="text-xs text-slate-500 mt-1">
							DWL Diagnóstica
						</p>
					</div>
				</div>

				{/* Rodapé */}
				<div className="mt-16 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
					Documento gerado pelo sistema de suporte técnico da DWL
					Diagnóstica.
				</div>
			</div>
		</div>
	);
}
