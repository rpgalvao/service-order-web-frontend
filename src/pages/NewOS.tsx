import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Save } from "lucide-react"; // Mais ícones premium!

export default function NewOS() {
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Nova O.S. | DWL Tech Support";
	}, []);

	// Nossos baldes para guardar o que o técnico digitar/selecionar
	const [customerId, setCustomerId] = useState("");
	const [equipmentId, setEquipmentId] = useState("");
	const [problemDescription, setProblemDescription] = useState("");

	const [loading, setLoading] = useState(false);

	const handleCreateOS = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Aqui nós vamos disparar o POST para /serviceorder amanhã!
			console.log("Dados prontos para envio:", {
				customerId,
				equipmentId,
				problem_description: problemDescription,
			});

			// Simulação rápida de sucesso
			setTimeout(() => {
				alert("O.S. Aberta com sucesso! (Simulação)");
				navigate("/dashboard");
			}, 1000);
		} catch (error) {
			console.error("Erro ao criar O.S.:", error);
			alert("Erro ao criar Ordem de Serviço.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-dwl-bg">
			{/* Cabeçalho Simplificado */}
			<header className="flex items-center bg-white border-b border-dwl-border/30 px-6 py-4 shadow-sm">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-500 hover:text-dwl-blue transition-colors font-semibold"
				>
					<ArrowLeft size={20} />
					Voltar ao Painel
				</button>
				<h1 className="ml-auto text-xl font-extrabold text-dwl-teal">
					Nova Ordem de Serviço
				</h1>
			</header>

			<main className="flex-1 p-8 max-w-4xl mx-auto w-full">
				<div className="rounded-xl border border-dwl-border/30 bg-white p-8 shadow-sm">
					<form onSubmit={handleCreateOS} className="space-y-6">
						{/* Linha 1: Cliente e Equipamento */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Cliente
								</label>
								<select
									required
									value={customerId}
									onChange={(e) =>
										setCustomerId(e.target.value)
									}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								>
									<option value="">
										Selecione um cliente...
									</option>
									<option value="id-ficticio-1">
										João da Silva
									</option>
									<option value="id-ficticio-2">
										Maria Oliveira
									</option>
								</select>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Equipamento
								</label>
								<select
									required
									value={equipmentId}
									onChange={(e) =>
										setEquipmentId(e.target.value)
									}
									className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-slate-900 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue"
								>
									<option value="">
										Selecione o equipamento...
									</option>
									<option value="id-equip-1">
										Notebook Dell Inspiron
									</option>
									<option value="id-equip-2">
										PC Gamer - Placa de Vídeo
									</option>
								</select>
							</div>
						</div>

						{/* Linha 2: Descrição do Problema */}
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Defeito Relatado / Problema
							</label>
							<textarea
								required
								rows={5}
								placeholder="Descreva com o máximo de detalhes o problema relatado pelo cliente..."
								value={problemDescription}
								onChange={(e) =>
									setProblemDescription(e.target.value)
								}
								className="w-full rounded-lg border border-dwl-border/50 bg-white p-3 text-slate-900 placeholder-slate-400 focus:border-dwl-blue focus:outline-none focus:ring-1 focus:ring-dwl-blue resize-y"
							/>
						</div>

						{/* Linha 3: Botão de Salvar */}
						<div className="flex justify-end pt-4 border-t border-dwl-border/20">
							<button
								type="submit"
								disabled={loading}
								className="flex items-center gap-2 rounded-lg bg-dwl-blue px-8 py-3 font-bold text-white transition-all hover:bg-dwl-teal focus:outline-none focus:ring-2 focus:ring-dwl-blue focus:ring-offset-2 active:scale-95 disabled:opacity-70"
							>
								<Save size={20} />
								{loading
									? "Abrindo O.S..."
									: "Abrir Ordem de Serviço"}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
