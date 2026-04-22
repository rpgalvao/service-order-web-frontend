import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. Importamos o componente
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NewOS from "./pages/newOS";
import NewEquipment from "./pages/NewEquipment";
import NewCustomer from "./pages/NewCustomer";

export default function App() {
	return (
		<BrowserRouter>
			{/* 2. O Toaster fica aqui, vigiando as notificações de todas as rotas */}
			<Toaster position="top-right" reverseOrder={false} />

			<Routes>
				<Route path="/" element={<Login />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path="/os/nova"
					element={
						<PrivateRoute>
							<NewOS />
						</PrivateRoute>
					}
				/>
				<Route
					path="/equipamentos/novo"
					element={
						<PrivateRoute>
							<NewEquipment />
						</PrivateRoute>
					}
				/>
				<Route
					path="/clientes/novo"
					element={
						<PrivateRoute>
							<NewCustomer />
						</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
