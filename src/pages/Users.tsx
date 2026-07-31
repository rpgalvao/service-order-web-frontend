import { useState, useEffect, useCallback } from "react";
import {
	Plus,
	Search,
	MoreHorizontal,
	Shield,
	User as UserIcon,
} from "lucide-react";
import { userService, type User } from "../services/userService";
import { NewUserDrawer } from "../components/ui/NewUserDrawer";

export function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await userService.getUsers();
			setUsers(data);
		} catch (error) {
			console.error("Erro ao buscar a lista de usuários:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Busca os dados reais da sua API assim que a página carrega
	useEffect(() => {
		loadUsers();
	}, []);

	// Filtra os usuários com base no campo de busca
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Cabeçalho da Página */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light">
						Usuários
					</h1>
					<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
						Gerencie os acessos da equipe técnica e administrativa.
					</p>
				</div>

				{/* TODO: Vamos ocultar este botão para quem não for ADMIN depois */}
				<button
					onClick={() => setIsDrawerOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-dwl-teal hover:bg-dwl-teal/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
				>
					<Plus className="w-5 h-5" />
					Novo Usuário
				</button>
			</div>

			{/* Barra de Ferramentas */}
			<div className="flex flex-col sm:flex-row gap-4 justify-between">
				<div className="relative flex-1 max-w-md">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-dwl-blue/50 dark:text-dwl-grey" />
					</div>
					<input
						type="text"
						placeholder="Buscar por nome ou e-mail..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg bg-app-lightSurface dark:bg-app-darkSurface text-dwl-blue dark:text-dwl-light placeholder-dwl-blue/50 dark:placeholder-dwl-grey focus:outline-none focus:ring-1 focus:ring-dwl-teal transition-colors"
					/>
				</div>
			</div>

			{/* Tabela de Dados */}
			<div className="bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-black/5 dark:bg-white/5 border-b border-app-border">
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Nome
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									E-mail
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Telefone
								</th>
								<th className="px-6 py-4 text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Nível de Acesso
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-dwl-blue dark:text-dwl-light whitespace-nowrap">
									Ações
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-app-border">
							{isLoading ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-8 text-center text-sm text-dwl-blue/60 dark:text-dwl-grey"
									>
										<div className="flex items-center justify-center gap-2">
											<div className="w-5 h-5 border-2 border-dwl-teal border-t-transparent rounded-full animate-spin" />
											Carregando usuários...
										</div>
									</td>
								</tr>
							) : filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
									>
										<td className="px-6 py-4 text-sm font-medium text-dwl-blue dark:text-dwl-light whitespace-nowrap flex items-center gap-3">
											{/* Placeholder de Avatar */}
											<div className="w-8 h-8 rounded-full bg-dwl-blue/10 dark:bg-white/10 flex items-center justify-center text-dwl-teal dark:text-dwl-cyan">
												{user.name
													.charAt(0)
													.toUpperCase()}
											</div>
											{user.name}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey whitespace-nowrap">
											{user.email}
										</td>
										<td className="px-6 py-4 text-sm text-dwl-blue/70 dark:text-dwl-grey whitespace-nowrap">
											{user.phone || "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.role === "ADMIN" ? (
												<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-dwl-teal/10 text-dwl-teal dark:text-dwl-cyan border border-dwl-teal/20">
													<Shield className="w-3 h-3" />{" "}
													Admin
												</span>
											) : (
												<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-dwl-blue/10 text-dwl-blue dark:text-dwl-light border border-dwl-blue/20">
													<UserIcon className="w-3 h-3" />{" "}
													Técnico
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-center whitespace-nowrap">
											<button className="p-1.5 text-dwl-blue/50 dark:text-dwl-grey hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
												<MoreHorizontal className="w-5 h-5" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-8 text-center text-sm text-dwl-blue/60 dark:text-dwl-grey"
									>
										Nenhum usuário encontrado.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<NewUserDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onSuccess={loadUsers}
			/>
		</div>
	);
}
