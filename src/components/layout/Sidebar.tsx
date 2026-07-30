import {
	LayoutDashboard,
	ClipboardList,
	Package,
	Users,
	Settings,
} from "lucide-react";
// 1. Adicionamos a importação do Link e useLocation
import { Link, useLocation } from "react-router-dom";
import logoDwl from "../../assets/logo_dwl.png";

export function Sidebar() {
	// 2. Lemos a URL atual para saber qual menu pintar de verde
	const location = useLocation();

	// 3. Adicionamos a propriedade "path" em vez de "active" manual
	const navItems = [
		{ label: "Dashboard", path: "/", icon: LayoutDashboard },
		{ label: "Ordens de Serviço", path: "/ordens", icon: ClipboardList },
		{ label: "Estoque", path: "/estoque", icon: Package },
		{ label: "Clientes", path: "/clientes", icon: Users },
		{ label: "Configurações", path: "/configuracoes", icon: Settings },
	];

	return (
		<aside className="w-64 bg-app-lightSurface dark:bg-app-darkSurface border-r border-app-border flex-shrink-0 hidden md:flex flex-col transition-colors duration-300">
			<div className="h-16 flex items-center justify-center px-6 border-b border-app-border transition-colors duration-300">
				<img
					src={logoDwl}
					alt="DWL Diagnóstica"
					className="h-10 w-auto object-contain transition-all duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
				/>
			</div>

			<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
				{navItems.map((item) => {
					const Icon = item.icon;
					// 4. Se a URL bater com o path, este menu está ativo
					const isActive = location.pathname === item.path;

					return (
						// 5. Trocamos de <a> para <Link> e href para to
						<Link
							key={item.label}
							to={item.path}
							className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
								isActive
									? "bg-dwl-teal/10 text-dwl-teal dark:text-dwl-cyan border-l-2 border-dwl-teal dark:border-dwl-cyan"
									: "text-dwl-blue dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/5 hover:text-dwl-teal dark:hover:text-dwl-light"
							}`}
						>
							<Icon className="w-5 h-5" />
							<span className="font-medium">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-app-border transition-colors duration-300">
				<div className="text-xs font-semibold text-center text-dwl-blue/60 dark:text-dwl-grey">
					Desenvolvido por RPG Sistemas
				</div>
			</div>
		</aside>
	);
}
