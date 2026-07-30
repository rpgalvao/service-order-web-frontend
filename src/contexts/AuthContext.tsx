import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

interface AuthContextData {
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Verifica se já existe um token salvo ao recarregar a página
		const token = localStorage.getItem("@dwl:token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const login = (token: string) => {
		localStorage.setItem("@dwl:token", token);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("@dwl:token");
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
