import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Customers } from "./pages/Customers";
import { Equipments } from "./pages/Equipments";
import { OrderDetails } from "./pages/OrderDetails";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Componente que atua como "Leão de Chácara" das rotas
function PrivateRoute({ children }: { children: ReactNode }) {
	// 1. Puxamos o isLoading do contexto
	const { isAuthenticated, isLoading } = useAuth();

	// 2. Se estiver carregando, mostramos uma tela de espera bonita
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-app-lightBg dark:bg-app-darkBg">
				<div className="flex items-center gap-3 text-dwl-blue dark:text-dwl-light">
					<div className="w-6 h-6 border-2 border-dwl-teal border-t-transparent rounded-full animate-spin" />
					<span className="font-medium">Carregando sistema...</span>
				</div>
			</div>
		);
	}

	// 3. Só avalia o redirecionamento DEPOIS que o isLoading for falso
	return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />

					<Route
						path="/"
						element={
							<PrivateRoute>
								<Layout>
									<Dashboard />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/ordens"
						element={
							<PrivateRoute>
								<Layout>
									<Orders />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/usuarios"
						element={
							<PrivateRoute>
								<Layout>
									<Users />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/clientes"
						element={
							<PrivateRoute>
								<Layout>
									<Customers />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/equipamentos"
						element={
							<PrivateRoute>
								<Layout>
									<Equipments />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/ordens/:id"
						element={
							<PrivateRoute>
								<Layout>
									<OrderDetails />
								</Layout>
							</PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
