import { useState } from "react";
import { User, Lock, Building2, Sliders, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type TabType = "PERFIL" | "EMPRESA" | "SISTEMA";

export function Settings() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("PERFIL");

	// Estados temporários apenas para o visual da tela
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	return (
		<div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 w-full min-w-0">
			<div className="flex-none">
				<h1 className="text-2xl font-bold text-dwl-blue dark:text-dwl-light transition-colors duration-300">
					Configurações
				</h1>
				<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey transition-colors duration-300 mt-1">
					Gerencie suas informações pessoais e preferências do
					sistema.
				</p>
			</div>

			<div className="flex-1 min-h-0 bg-app-lightSurface dark:bg-app-darkSurface rounded-xl border border-app-border shadow-sm w-full flex flex-col md:flex-row overflow-hidden">
				{/* Menu Lateral de Abas */}
				<div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-app-border bg-black/5 dark:bg-white/5 flex flex-row md:flex-col p-4 gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
					<button
						onClick={() => setActiveTab("PERFIL")}
						className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap md:whitespace-normal ${
							activeTab === "PERFIL"
								? "bg-dwl-teal text-white shadow-md"
								: "text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10"
						}`}
					>
						<User className="w-5 h-5" />
						Meu Perfil
					</button>

					{/* Mostra as opções avançadas apenas se for ADMIN */}
					{user?.role === "ADMIN" && (
						<>
							<button
								onClick={() => setActiveTab("EMPRESA")}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap md:whitespace-normal ${
									activeTab === "EMPRESA"
										? "bg-dwl-teal text-white shadow-md"
										: "text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10"
								}`}
							>
								<Building2 className="w-5 h-5" />
								Dados da Empresa
							</button>
							<button
								onClick={() => setActiveTab("SISTEMA")}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap md:whitespace-normal ${
									activeTab === "SISTEMA"
										? "bg-dwl-teal text-white shadow-md"
										: "text-dwl-blue dark:text-dwl-light hover:bg-black/5 dark:hover:bg-white/10"
								}`}
							>
								<Sliders className="w-5 h-5" />
								Parametrizações
							</button>
						</>
					)}
				</div>

				{/* Área de Conteúdo */}
				<div className="flex-1 p-6 overflow-y-auto">
					{/* ABA: MEU PERFIL */}
					{activeTab === "PERFIL" && (
						<div className="max-w-2xl space-y-8 animate-in fade-in">
							<section>
								<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 border-b border-app-border pb-2">
									Informações Pessoais
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											Nome Completo
										</label>
										<input
											type="text"
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											E-mail
										</label>
										<input
											type="email"
											value={email}
											disabled
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue/50 dark:text-dwl-grey cursor-not-allowed"
											title="O e-mail de acesso não pode ser alterado"
										/>
									</div>
								</div>
								<div className="mt-4">
									<button className="px-6 py-2 bg-dwl-teal text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 transition-colors flex items-center gap-2">
										<Save className="w-4 h-4" /> Atualizar
										Perfil
									</button>
								</div>
							</section>

							<section>
								<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 border-b border-app-border pb-2 flex items-center gap-2">
									<Lock className="w-5 h-5 text-dwl-teal" />{" "}
									Segurança
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											Senha Atual
										</label>
										<input
											type="password"
											value={currentPassword}
											onChange={(e) =>
												setCurrentPassword(
													e.target.value,
												)
											}
											placeholder="••••••••"
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											Nova Senha
										</label>
										<input
											type="password"
											value={newPassword}
											onChange={(e) =>
												setNewPassword(e.target.value)
											}
											placeholder="••••••••"
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal"
										/>
									</div>
								</div>
								<div className="mt-4">
									<button className="px-6 py-2 bg-dwl-blue dark:bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-dwl-blue/90 dark:hover:bg-white/20 transition-colors">
										Alterar Senha
									</button>
								</div>
							</section>
						</div>
					)}

					{/* ABA: EMPRESA (Placeholder) */}
					{activeTab === "EMPRESA" && (
						<div className="max-w-2xl space-y-4 animate-in fade-in">
							<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-2">
								Dados Cadastrais
							</h3>
							<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mb-6">
								Estas informações serão utilizadas na geração de
								documentos e impressões de Ordens de Serviço.
							</p>

							<div className="p-8 border-2 border-dashed border-app-border rounded-xl text-center flex flex-col items-center justify-center bg-black/5 dark:bg-white/5">
								<Building2 className="w-12 h-12 text-dwl-blue/30 dark:text-dwl-grey mb-3" />
								<h4 className="font-bold text-dwl-blue dark:text-dwl-light">
									Módulo em Desenvolvimento
								</h4>
								<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
									A edição dos dados da empresa estará
									disponível nas próximas atualizações.
								</p>
							</div>
						</div>
					)}

					{/* ABA: SISTEMA (Placeholder) */}
					{activeTab === "SISTEMA" && (
						<div className="max-w-2xl space-y-4 animate-in fade-in">
							<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-2">
								Parâmetros Globais
							</h3>
							<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mb-6">
								Configurações de regras de negócio e termos
								legais.
							</p>

							<div className="p-8 border-2 border-dashed border-app-border rounded-xl text-center flex flex-col items-center justify-center bg-black/5 dark:bg-white/5">
								<Sliders className="w-12 h-12 text-dwl-blue/30 dark:text-dwl-grey mb-3" />
								<h4 className="font-bold text-dwl-blue dark:text-dwl-light">
									Módulo em Desenvolvimento
								</h4>
								<p className="text-sm text-dwl-blue/70 dark:text-dwl-grey mt-1">
									O controle de parâmetros do sistema estará
									disponível nas próximas atualizações.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
