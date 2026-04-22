import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NewOS from "./pages/newOS"; // Ajustado para bater com o nome do arquivo

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />

				{/* Rota do Dashboard protegida */}
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>

				{/* AGORA SIM: A rota da Nova O.S. está dentro do <Routes> */}
				<Route
					path="/os/nova"
					element={
						<PrivateRoute>
							<NewOS />
						</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
