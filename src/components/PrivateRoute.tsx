import type { JSX } from "react";
import { Navigate } from "react-router-dom";

// Esse componente "abraça" as telas que precisam de proteção
export default function PrivateRoute({ children }: { children: JSX.Element }) {
	// O Guarda olha se existe um token no bolso (localStorage) do navegador
	const token = localStorage.getItem("@dwl:token");

	// Se não tiver token, ele te joga de volta para a tela de Login ("/")
	if (!token) {
		return <Navigate to="/" replace />;
	}

	// Se tiver token, ele abre a porta e deixa você ver a tela (children)
	return children;
}
