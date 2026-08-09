import { useState } from "react";
import { Package, Building2, ArrowRightLeft } from "lucide-react";
import { Suppliers } from "./Suppliers";
import { Parts } from "./Parts";
import { StockMovements } from "./StockMovements";

type TabType = "PECAS" | "FORNECEDORES" | "MOVIMENTACOES";

export function Inventory() {
	const [activeTab, setActiveTab] = useState<TabType>("PECAS");

	return (
		<div className="flex flex-col h-full animate-in fade-in duration-300">
			{/* Cabeçalho da Central de Estoque */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light">
					Controle de Estoque
				</h1>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
					Gerencie o catálogo de peças, fornecedores e acompanhe as
					movimentações.
				</p>
			</div>

			{/* Container Principal com as Abas */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-300">
				{/* Navegação das Abas */}
				<div className="flex border-b border-app-border bg-black/5 dark:bg-white/5 overflow-x-auto">
					<button
						onClick={() => setActiveTab("PECAS")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
							activeTab === "PECAS"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<Package className="w-4 h-4" /> Catálogo de Peças
					</button>

					<button
						onClick={() => setActiveTab("FORNECEDORES")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
							activeTab === "FORNECEDORES"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<Building2 className="w-4 h-4" /> Fornecedores
					</button>

					<button
						onClick={() => setActiveTab("MOVIMENTACOES")}
						className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
							activeTab === "MOVIMENTACOES"
								? "border-dwl-teal text-dwl-teal bg-app-lightSurface dark:bg-app-darkSurface"
								: "border-transparent text-dwl-blue/70 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5"
						}`}
					>
						<ArrowRightLeft className="w-4 h-4" /> Histórico (Log)
					</button>
				</div>

				{/* Conteúdo Dinâmico da Aba Selecionada */}
				<div className="flex-1 overflow-auto p-6 relative">
					{activeTab === "PECAS" && (
						<div className="flex flex-col items-center justify-center h-full text-dwl-blue/50 dark:text-dwl-grey py-12">
							<Parts />
						</div>
					)}

					{activeTab === "FORNECEDORES" && (
						/* Renderiza a tela de fornecedores inteira aqui dentro! */
						<div className="h-full animate-in fade-in duration-300">
							<Suppliers />
						</div>
					)}

					{activeTab === "MOVIMENTACOES" && (
						<div className="h-full animate-in fade-in duration-300">
							<StockMovements />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
