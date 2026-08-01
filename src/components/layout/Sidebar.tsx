import {
	LayoutDashboard,
	ClipboardList,
	Package,
	Users,
	Settings,
	UserCog,
	Monitor,
	X, // Ícone para fechar no mobile
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoDwl from "../../assets/logo_dwl.png";

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
	const location = useLocation();

	const navItems = [
		{ label: "Dashboard", path: "/", icon: LayoutDashboard },
		{ label: "Ordens de Serviço", path: "/ordens", icon: ClipboardList },
		{ label: "Clientes", path: "/clientes", icon: Users },
		{ label: "Equipamentos", path: "/equipamentos", icon: Monitor },
		{ label: "Estoque", path: "/estoque", icon: Package },
		{ label: "Usuários", path: "/usuarios", icon: UserCog },
		{ label: "Configurações", path: "/configuracoes", icon: Settings },
	];

	return (
		<>
			{/* Fundo escuro para mobile (Backdrop) */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Barra Lateral */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-app-lightSurface dark:bg-app-darkSurface border-r border-app-border flex-shrink-0 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="h-16 flex items-center justify-between px-6 border-b border-app-border transition-colors duration-300">
					<img
						src={logoDwl}
						alt="DWL Diagnóstica"
						className="h-10 w-auto object-contain transition-all duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
					/>
					{/* Botão de fechar visível apenas no mobile */}
					<button
						className="md:hidden text-dwl-blue/50 dark:text-dwl-grey hover:text-dwl-blue dark:hover:text-dwl-light"
						onClick={() => setIsOpen(false)}
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;

						return (
							<Link
								key={item.label}
								to={item.path}
								onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um link no celular
								className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
									isActive
										? "bg-dwl-teal/10 text-dwl-teal dark:text-dwl-cyan border-l-2 border-dwl-teal dark:border-dwl-cyan"
										: "text-dwl-blue dark:text-dwl-grey hover:bg-black/5 dark:hover:bg-white/5 hover:text-dwl-teal dark:hover:text-dwl-light"
								}`}
							>
								<Icon className="w-5 h-5" />
								<span className="font-medium">
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t border-app-border transition-colors duration-300">
					<div className="text-xs font-semibold text-center text-dwl-blue/60 dark:text-dwl-grey">
						Desenvolvido por{" "}
						<a
							href="http://www.rpgsistemas.com.br"
							target="_blank"
							rel="noopener noreferrer"
						>
							@rpg Sistemas
						</a>
					</div>
				</div>
			</aside>
		</>
	);
}
