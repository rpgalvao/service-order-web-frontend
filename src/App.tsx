import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Customers } from "./pages/Customers";
import { Equipments } from "./pages/Equipments";
import { EquipmentModels } from "./pages/EquipmentModels";
import { OrderDetails } from "./pages/OrderDetails";
import { Checklists } from "./pages/Checklists";
import { Inventory } from "./pages/Inventory";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Settings } from "./pages/Settings";
import { ResetPassword } from "./pages/ResetPassword";

function PrivateRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

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

	return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading, user } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-app-lightBg dark:bg-app-darkBg">
				<div className="flex items-center gap-3 text-dwl-blue dark:text-dwl-light">
					<div className="w-6 h-6 border-2 border-dwl-teal border-t-transparent rounded-full animate-spin" />
					<span className="font-medium">
						Verificando permissões...
					</span>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) return <Navigate to="/login" />;

	if (user?.role !== "ADMIN") return <Navigate to="/" />;

	return children;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/redefinir-senha"
						element={<ResetPassword />}
					/>
					{/* Rotas Comuns (Técnicos e Admins) */}
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
						path="/ordens/:id"
						element={
							<PrivateRoute>
								<Layout>
									<OrderDetails />
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
						path="/modelos"
						element={
							<PrivateRoute>
								<Layout>
									<EquipmentModels />
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
						path="/estoque"
						element={
							<PrivateRoute>
								<Layout>
									<Inventory />
								</Layout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/configuracoes"
						element={
							<PrivateRoute>
								<Layout>
									<Settings />
								</Layout>
							</PrivateRoute>
						}
					/>{" "}
					{/* 🟢 Rota liberada! */}
					{/* Rotas Restritas (Somente Admins) */}
					<Route
						path="/checklists"
						element={
							<AdminRoute>
								<Layout>
									<Checklists />
								</Layout>
							</AdminRoute>
						}
					/>
					<Route
						path="/usuarios"
						element={
							<AdminRoute>
								<Layout>
									<Users />
								</Layout>
							</AdminRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
