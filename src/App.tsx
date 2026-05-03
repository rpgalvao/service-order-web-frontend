import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. Importamos o componente
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NewOS from "./pages/NewOS";
import NewEquipment from "./pages/NewEquipment";
import NewCustomer from "./pages/NewCustomer";
import Customers from "./pages/Customers";
import Equipments from "./pages/Equipments";
import EditCustomer from "./pages/EditCustomer";
import EditEquipment from "./pages/EditEquipment";

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
				<Route
					path="/clientes"
					element={
						<PrivateRoute>
							<Customers />
						</PrivateRoute>
					}
				/>
				<Route
					path="/equipamentos"
					element={
						<PrivateRoute>
							<Equipments />
						</PrivateRoute>
					}
				/>
				<Route
					path="/clientes/editar/:id"
					element={
						<PrivateRoute>
							<EditCustomer />
						</PrivateRoute>
					}
				/>
				<Route
					path="/equipamentos/editar/:id"
					element={
						<PrivateRoute>
							<EditEquipment />
						</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
