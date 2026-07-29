import {
	LayoutDashboard,
	ClipboardList,
	Package,
	Users,
	Settings,
} from "lucide-react";
// Importando a imagem diretamente da pasta assets
import logoDwl from "../../assets/logo_dwl.png";

export function Sidebar() {
	const navItems = [
		{ label: "Dashboard", icon: LayoutDashboard, active: true },
		{ label: "Ordens de Serviço", icon: ClipboardList, active: false },
		{ label: "Estoque", icon: Package, active: false },
		{ label: "Clientes", icon: Users, active: false },
		{ label: "Configurações", icon: Settings, active: false },
	];

	return (
		<aside className="w-64 bg-app-lightSurface dark:bg-app-darkSurface border-r border-app-border flex-shrink-0 hidden md:flex flex-col transition-colors duration-300">
			{/* Área do Logotipo */}
			<div className="h-16 flex items-center justify-center px-6 border-b border-app-border transition-colors duration-300">
				<img
					src={logoDwl}
					alt="DWL Diagnóstica"
					// Removido o bg-white. Adicionado um drop-shadow branco personalizado para o modo dark
					className="h-10 w-auto object-contain transition-all duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
				/>
			</div>

			{/* Navegação Principal */}
			<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<a
							key={item.label}
							href="#"
							className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
								item.active
									? "bg-dwl-teal/10 text-dwl-teal dark:text-dwl-cyan border-l-2 border-dwl-teal dark:border-dwl-cyan"
									: "text-dwl-blue dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/5 hover:text-dwl-teal dark:hover:text-dwl-light"
							}`}
						>
							<Icon className="w-5 h-5" />
							<span className="font-medium">{item.label}</span>
						</a>
					);
				})}
			</nav>

			{/* Rodapé da Sidebar */}
			<div className="p-4 border-t border-app-border transition-colors duration-300">
				<div className="text-xs font-semibold text-center text-dwl-blue/60 dark:text-dwl-grey">
					Desenvolvido por RPG Sistemas
				</div>
			</div>
		</aside>
	);
}
