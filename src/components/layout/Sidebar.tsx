import {
	LayoutDashboard,
	ClipboardList,
	Package,
	Users,
	Settings,
	UserCog,
	Monitor,
	X,
	FileSignature,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoDwl from "../../assets/logo_dwl.png";

// 1. Importamos o seu hook de autenticação
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
	const location = useLocation();

	// 2. Extraímos o usuário logado do contexto
	const { user } = useAuth();

	// 3. Adicionamos a propriedade opcional 'adminOnly' nos menus que precisam ser ocultados
	const navItems = [
		{ label: "Dashboard", path: "/", icon: LayoutDashboard },
		{ label: "Ordens de Serviço", path: "/ordens", icon: ClipboardList },
		{ label: "Clientes", path: "/clientes", icon: Users },
		{ label: "Equipamentos", path: "/equipamentos", icon: Monitor },
		{
			label: "Checklists",
			path: "/checklists",
			icon: FileSignature,
			adminOnly: true,
		},
		{ label: "Estoque", path: "/estoque", icon: Package, adminOnly: true },
		{
			label: "Usuários",
			path: "/usuarios",
			icon: UserCog,
			adminOnly: true,
		},
		{ label: "Configurações", path: "/configuracoes", icon: Settings },
	];

	// 4. Filtramos a lista de menus ANTES de renderizar na tela
	const visibleNavItems = navItems.filter((item) => {
		// Se o menu for exclusivo para admin, só retorna true se o role do usuário for ADMIN
		if (item.adminOnly) {
			return user?.role === "ADMIN";
		}
		// Se não tiver a flag, o menu é público (aparece para todos)
		return true;
	});

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
					{/* 5. Fazemos o .map() em cima da nossa lista filtrada (visibleNavItems) */}
					{visibleNavItems.map((item) => {
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
