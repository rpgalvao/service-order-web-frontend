import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Quando a URL for apenas '/', mostra o Login */}
				<Route path="/" element={<Login />} />

				{/* Quando a URL for '/dashboard', mostra o Painel */}
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}
