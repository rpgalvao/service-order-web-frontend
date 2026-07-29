import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<div className="flex h-screen w-full overflow-hidden transition-colors duration-300">
			<Sidebar />

			<div className="flex flex-col flex-1 w-full overflow-hidden">
				<Header />

				<main className="flex-1 overflow-auto p-6 bg-app-lightBg dark:bg-app-darkBg transition-colors duration-300">
					{children}
				</main>
			</div>
		</div>
	);
}
