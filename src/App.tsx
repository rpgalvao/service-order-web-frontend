import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Login } from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Componente que atua como "Leão de Chácara" das rotas
function PrivateRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Rota Pública */}
					<Route path="/login" element={<Login />} />

					{/* Rotas Privadas encapsuladas no Layout */}
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
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
