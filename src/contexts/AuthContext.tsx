import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface UserPayload {
	id: string;
	name: string;
	role: "ADMIN" | "TECHNICIAN";
}

interface AuthContextData {
	isAuthenticated: boolean;
	user: UserPayload | null;
	isLoading: boolean; // 1. Adicionamos a variável na interface
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserPayload | null>(null);

	// 2. Iniciamos como TRUE, afinal, não sabemos se ele tem token ainda
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("@dwl:token");
		if (token) {
			try {
				const decoded = jwtDecode<UserPayload>(token);
				setUser(decoded);
				setIsAuthenticated(true);
			} catch (error) {
				logout();
			}
		}
		// 3. Após conferir o token (dando certo ou errado), avisamos que terminou de carregar
		setIsLoading(false);
	}, []);

	const login = (token: string) => {
		localStorage.setItem("@dwl:token", token);
		const decoded = jwtDecode<UserPayload>(token);
		setUser(decoded);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("@dwl:token");
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		// 4. Passamos o isLoading para o resto da aplicação
		<AuthContext.Provider
			value={{ isAuthenticated, user, isLoading, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
