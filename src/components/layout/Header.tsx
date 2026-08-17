import { useState, useEffect, useRef } from "react";
import {
	Moon,
	Sun,
	Search,
	Bell,
	User,
	Menu,
	LogOut,
	UserCog,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Ajuste o caminho se necessário
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

	// Trazendo os dados e a função de sair do nosso Contexto
	const { user, logout } = useAuth();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (document.documentElement.classList.contains("dark")) {
			setIsDarkMode(true);
		}
	}, []);

	// Fecha o menu se o usuário clicar fora dele
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsProfileMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		setIsDarkMode(!isDarkMode);
	};

	const navigate = useNavigate();

	return (
		<header className="h-16 bg-app-lightSurface dark:bg-app-darkSurface border-b border-app-border flex-shrink-0 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
			{/* Lado Esquerdo: Menu Mobile e Pesquisa */}
			<div className="flex items-center flex-1 gap-2 sm:gap-4">
				<button
					onClick={onOpenSidebar}
					className="md:hidden p-2 -ml-2 rounded-lg text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
				>
					<Menu className="w-6 h-6" />
				</button>

				<div className="flex-1 max-w-lg flex items-center bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-dwl-teal transition-all">
					<Search className="w-5 h-5 text-dwl-blue/50 dark:text-dwl-grey shrink-0" />
					<input
						type="text"
						placeholder="Busca global (Ex: #1042)..."
						className="w-full bg-transparent border-none outline-none text-sm px-3 text-dwl-blue dark:text-dwl-light placeholder:text-dwl-blue/50 dark:placeholder:text-dwl-grey"
					/>
				</div>
			</div>

			{/* Ações e Perfil */}
			<div className="flex items-center gap-2 sm:gap-4 ml-4">
				<button className="relative p-2 rounded-full text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200">
					<Bell className="w-5 h-5" />
					<span className="absolute top-1 right-2 w-2 h-2 bg-dwl-teal rounded-full border border-white dark:border-app-darkSurface"></span>
				</button>

				<button
					onClick={toggleTheme}
					className="p-2 rounded-full text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
				>
					{isDarkMode ? (
						<Sun className="w-5 h-5" />
					) : (
						<Moon className="w-5 h-5" />
					)}
				</button>

				<div className="h-6 w-px bg-app-border mx-1"></div>

				{/* Perfil do Usuário com Dropdown */}
				<div className="relative" ref={menuRef}>
					<button
						onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
						className="flex items-center gap-2 hover:opacity-80 transition-opacity"
					>
						<div className="w-8 h-8 rounded-full bg-dwl-teal/20 flex items-center justify-center text-dwl-teal dark:text-dwl-cyan shrink-0 overflow-hidden border border-dwl-teal/30">
							{/* 🟢 Verificação do Avatar */}
							{user?.avatar_url ? (
								<img
									src={user.avatar_url}
									alt={user.name}
									className="w-full h-full object-cover"
								/>
							) : user?.name ? (
								<span className="font-bold text-sm">
									{user.name.charAt(0).toUpperCase()}
								</span>
							) : (
								<User className="w-5 h-5" />
							)}
						</div>
						<span className="text-sm font-medium text-dwl-blue dark:text-dwl-light hidden sm:block">
							{user?.name || "Carregando..."}
						</span>
					</button>

					{/* Dropdown Menu */}
					{isProfileMenuOpen && (
						<div className="absolute right-0 mt-3 w-48 bg-app-lightSurface dark:bg-app-darkSurface rounded-lg shadow-lg border border-app-border py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
							<div className="px-4 py-2 border-b border-app-border mb-1">
								<p className="text-sm font-medium text-dwl-blue dark:text-dwl-light truncate">
									{user?.name}
								</p>
								<p className="text-xs text-dwl-blue/60 dark:text-dwl-grey truncate">
									{user?.role === "ADMIN"
										? "Administrador"
										: "Técnico"}
								</p>
							</div>

							{/* Botão de Meu Perfil */}
							<button
								onClick={() => {
									setIsProfileMenuOpen(false);
									navigate("/configuracoes"); // 🟢 Roteamento ativado!
								}}
								className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
							>
								<UserCog className="w-4 h-4" />
								Meu Perfil
							</button>

							{/* Botão de Sair */}
							<button
								onClick={() => {
									setIsProfileMenuOpen(false);
									logout();
								}}
								className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
							>
								<LogOut className="w-4 h-4" />
								Sair do Sistema
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
