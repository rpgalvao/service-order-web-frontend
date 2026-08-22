import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/api";

interface UserPayload {
	id: string;
	name: string;
	email: string;
	phone: string;
	avatar_url: string;
	signature_url?: string;
	role: "ADMIN" | "TECHNICIAN";
}

interface AuthContextData {
	isAuthenticated: boolean;
	user: UserPayload | null;
	isLoading: boolean; // 1. Adicionamos a variável na interface
	login: (token: string, userData: UserPayload) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserPayload | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadUser = async () => {
			const token = localStorage.getItem("@dwl:token");
			if (token) {
				try {
					// 1. Decodifica apenas para pegar o ID
					const decoded = jwtDecode<{ id: string; role: string }>(
						token,
					);

					// 2. Garante que o token está no cabeçalho antes de chamar a API
					api.defaults.headers.Authorization = `Bearer ${token}`;

					// 3. Busca a "ficha completa" do usuário direto do banco
					const response = await api.get(`/user/${decoded.id}`);

					// 4. Salva o usuário completo no estado global
					setUser(response.data.data);
					setIsAuthenticated(true);
				} catch (error) {
					logout();
				}
			}
			setIsLoading(false);
		};

		loadUser();
	}, []);

	// No login, nós já recebemos o "userData" da resposta da API de login e salvamos direto
	const login = (token: string, userData: UserPayload) => {
		localStorage.setItem("@dwl:token", token);
		api.defaults.headers.Authorization = `Bearer ${token}`; // Já injeta no Axios
		setUser(userData);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("@dwl:token");
		delete api.defaults.headers.Authorization; // Limpa do Axios
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, user, isLoading, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
