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
	isLoading: boolean;
	login: (token: string, userData: UserPayload) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserPayload | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const logout = () => {
		localStorage.removeItem("@dwl:token");
		delete api.defaults.headers.Authorization;
		setUser(null);
		setIsAuthenticated(false);
	};

	useEffect(() => {
		// 🟢 NOVO: Interceptor Global do Axios
		const interceptorId = api.interceptors.response.use(
			(response) => response, // Se der sucesso (200, 201), deixa passar normalmente
			(error) => {
				// Se o backend avisar que o token é inválido/expirado (401)
				if (error.response?.status === 401) {
					window.alert(
						"Sua sessão expirou. Por favor, faça login novamente.",
					);
					logout(); // Executa a limpeza e aciona o PrivateRoute para redirecionar
				}
				return Promise.reject(error);
			},
		);

		const loadUser = async () => {
			const token = localStorage.getItem("@dwl:token");
			if (token) {
				try {
					const decoded = jwtDecode<{ id: string; role: string }>(
						token,
					);
					api.defaults.headers.Authorization = `Bearer ${token}`;

					const response = await api.get(`/user/${decoded.id}`);

					setUser(response.data.data);
					setIsAuthenticated(true);
				} catch (error) {
					logout();
				}
			}
			setIsLoading(false);
		};

		loadUser();

		// Limpa o interceptor quando o componente desmontar para evitar vazamento de memória
		return () => {
			api.interceptors.response.eject(interceptorId);
		};
	}, []);

	const login = (token: string, userData: UserPayload) => {
		localStorage.setItem("@dwl:token", token);
		api.defaults.headers.Authorization = `Bearer ${token}`;
		setUser(userData);
		setIsAuthenticated(true);
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
