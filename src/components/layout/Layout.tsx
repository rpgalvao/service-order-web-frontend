import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	// Estado que controla se a barra lateral está aberta no mobile
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen w-full overflow-hidden transition-colors duration-300">
			{/* Passamos o controle para o Sidebar */}
			<Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

			<div className="flex flex-col flex-1 w-full overflow-hidden">
				{/* Passamos a função de abrir para o Header */}
				<Header onOpenSidebar={() => setIsSidebarOpen(true)} />

				<main className="flex-1 overflow-auto p-6 bg-app-lightBg dark:bg-app-darkBg transition-colors duration-300">
					{children}
				</main>
			</div>
		</div>
	);
}
