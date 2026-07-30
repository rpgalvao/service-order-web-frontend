import { useState, useEffect } from "react";
import { Moon, Sun, Search, Bell, User } from "lucide-react";

export function Header() {
	// Estado para controlar qual tema está ativo
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Verifica qual tema está ativo logo que o componente carrega (evita dessincronização)
	useEffect(() => {
		if (document.documentElement.classList.contains("dark")) {
			setIsDarkMode(true);
		}
	}, []);

	const toggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		setIsDarkMode(!isDarkMode);
	};

	return (
		<header className="h-16 bg-app-lightSurface dark:bg-app-darkSurface border-b border-app-border flex-shrink-0 flex items-center justify-between px-6 transition-colors duration-300">
			{/* Barra de Pesquisa */}
			<div className="flex-1 max-w-lg flex items-center bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-dwl-teal transition-all">
				<Search className="w-5 h-5 text-dwl-blue/50 dark:text-dwl-grey" />
				<input
					type="text"
					placeholder="Busca global no sistema (Ex: #1042)..."
					className="w-full bg-transparent border-none outline-none text-sm px-3 text-dwl-blue dark:text-dwl-light placeholder:text-dwl-blue/50 dark:placeholder:text-dwl-grey"
				/>
			</div>

			{/* Ações e Perfil */}
			<div className="flex items-center gap-4 ml-4">
				{/* Ícone de Notificações com indicador de "novo" */}
				<button className="relative p-2 rounded-full text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200">
					<Bell className="w-5 h-5" />
					<span className="absolute top-1 right-2 w-2 h-2 bg-dwl-teal rounded-full border border-white dark:border-app-darkSurface"></span>
				</button>

				{/* Botão de tema dinâmico que transferimos pra cá */}
				<button
					onClick={toggleTheme}
					title={
						isDarkMode
							? "Mudar para Tema Claro"
							: "Mudar para Tema Escuro"
					}
					className="p-2 rounded-full text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
				>
					{isDarkMode ? (
						<Sun className="w-5 h-5" />
					) : (
						<Moon className="w-5 h-5" />
					)}
				</button>

				{/* Divisor Visual */}
				<div className="h-6 w-px bg-app-border mx-1"></div>

				{/* Perfil do Usuário */}
				<button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
					<div className="w-8 h-8 rounded-full bg-dwl-teal/20 flex items-center justify-center text-dwl-teal dark:text-dwl-cyan">
						<User className="w-5 h-5" />
					</div>
					<span className="text-sm font-medium text-dwl-blue dark:text-dwl-light hidden sm:block">
						Técnico DWL
					</span>
				</button>
			</div>
		</header>
	);
}
