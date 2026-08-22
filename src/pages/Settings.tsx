import { useState, useRef, useEffect } from "react";
import {
	User,
	Lock,
	Building2,
	Sliders,
	Save,
	Upload,
	PenTool,
	Eraser,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import SignatureCanvas from "react-signature-canvas";
import { api } from "../lib/api";
import { formatPhone } from "../utils/formatters";

type TabType = "PERFIL" | "EMPRESA" | "SISTEMA";

export function Settings() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("PERFIL");

	// Estados do Perfil
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [phone, setPhone] = useState("");
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	// Estados de Segurança
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	// Estados de UI (Carregamento e Mensagens)
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState({ type: "", text: "" });

	// Referências
	const fileInputRef = useRef<HTMLInputElement>(null);
	const sigCanvas = useRef<SignatureCanvas>(null);

	const [avatarFile, setAvatarFile] = useState<File | null>(null); // NOVO ESTADO

	useEffect(() => {
		if (user) {
			setName(user.name || "");
			setEmail(user.email || "");
			setPhone(user.phone ? formatPhone(user.phone) : "");
			setAvatarPreview(user.avatar_url || null);

			// Um pequeno atraso garante que o Canvas já foi renderizado na tela antes de injetar a imagem da assinatura
			setTimeout(() => {
				if (user.signature_url && sigCanvas.current) {
					sigCanvas.current.fromDataURL(user.signature_url);
				}
			}, 100);
		}
	}, [user]);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file); // Guarda o arquivo físico para mandar via FormData

			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Função para limpar o quadro de assinatura
	const clearSignature = () => {
		sigCanvas.current?.clear();
	};

	// Função que empacota tudo e envia para o backend
	const handleSaveProfile = async () => {
		setIsLoading(true);
		setMessage({ type: "", text: "" });

		try {
			// Trava de segurança: Se não tiver ID, ele nem tenta enviar
			if (!user?.id) {
				throw new Error(
					"ID do usuário não encontrado. Recarregue a página.",
				);
			}

			const formData = new FormData();

			if (name) formData.append("name", name);
			if (phone) formData.append("phone", phone);
			if (avatarFile) formData.append("avatar", avatarFile);

			// Extração da assinatura com Fallback (Se o Canvas bugar, ele não trava a tela)
			let signatureData = null;
			if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
				try {
					signatureData = sigCanvas.current
						.getTrimmedCanvas()
						.toDataURL("image/png");
				} catch (canvasError) {
					// Fallback caso a extração com margem cortada falhe
					signatureData = sigCanvas.current.toDataURL("image/png");
				}
			}

			if (signatureData) {
				formData.append("signature_url", signatureData);
			}

			if (currentPassword)
				formData.append("currentPassword", currentPassword);
			if (newPassword) formData.append("newPassword", newPassword);

			await api.patch(`/user/${user.id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setMessage({
				type: "success",
				text: "Perfil atualizado com sucesso!",
			});
			setCurrentPassword("");
			setNewPassword("");
		} catch (error: any) {
			console.error("Erro capturado no frontend:", error); // 🔎 Se algo der errado, isso vai revelar no console (F12) o exato motivo!

			const errorMsg =
				error.response?.data?.message ||
				error.message ||
				"Ocorreu um erro ao atualizar o perfil.";
			setMessage({ type: "error", text: errorMsg });
		} finally {
			setIsLoading(false);
		}
	};

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

				<div className="flex-1 p-6 overflow-y-auto">
					{activeTab === "PERFIL" && (
						<div className="max-w-2xl space-y-8 animate-in fade-in">
							{message.text && (
								<div
									className={`p-4 rounded-lg text-sm font-medium border ${message.type === "success" ? "bg-dwl-teal/10 border-dwl-teal/20 text-dwl-teal dark:text-dwl-cyan" : "bg-red-500/10 border-red-500/20 text-red-600"}`}
								>
									{message.text}
								</div>
							)}

							{/* Área de Avatar */}
							<section>
								<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 border-b border-app-border pb-2">
									Informações Pessoais
								</h3>

								<div className="flex items-center gap-6 mb-6">
									<div className="w-20 h-20 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex items-center justify-center border border-app-border shrink-0">
										{avatarPreview ? (
											<img
												src={avatarPreview}
												alt="Avatar"
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="w-8 h-8 text-dwl-blue/50 dark:text-dwl-grey" />
										)}
									</div>
									<div>
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleAvatarChange}
											accept="image/*"
											className="hidden"
										/>
										<button
											onClick={() =>
												fileInputRef.current?.click()
											}
											className="px-4 py-2 bg-dwl-blue/10 dark:bg-white/5 text-dwl-blue dark:text-dwl-light rounded-lg text-sm font-medium hover:bg-dwl-blue/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2 mb-1"
										>
											<Upload className="w-4 h-4" />{" "}
											Alterar Foto
										</button>
										<p className="text-xs text-dwl-blue/50 dark:text-dwl-grey">
											Recomendado: JPG ou PNG quadrado.
										</p>
									</div>
								</div>

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
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											E-mail de Acesso
										</label>
										<input
											type="email"
											value={email}
											disabled
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-black/5 dark:bg-white/5 text-dwl-blue/50 dark:text-dwl-grey cursor-not-allowed outline-none"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-dwl-blue dark:text-dwl-light mb-1.5">
											Telefone / Celular
										</label>
										<input
											type="text"
											value={phone}
											onChange={(e) =>
												setPhone(
													formatPhone(e.target.value),
												)
											}
											placeholder="(00) 00000-0000"
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none"
										/>
									</div>
								</div>
							</section>

							{/* Área de Assinatura Digital com o react-signature-canvas */}
							<section>
								<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 border-b border-app-border pb-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<PenTool className="w-5 h-5 text-dwl-teal" />{" "}
										Assinatura para O.S.
									</div>
									<button
										onClick={clearSignature}
										className="text-xs flex items-center gap-1 text-dwl-blue/60 hover:text-red-500 transition-colors"
										title="Limpar quadro"
									>
										<Eraser className="w-3 h-3" /> Limpar
									</button>
								</h3>
								<div className="p-4 border-2 border-dashed border-app-border rounded-xl flex flex-col items-center justify-center bg-white dark:bg-black/20 gap-3">
									<div className="w-full max-w-sm h-32 border border-dwl-blue/10 dark:border-white/10 rounded-lg bg-white overflow-hidden touch-none relative cursor-crosshair">
										<SignatureCanvas
											ref={sigCanvas}
											penColor="#225378" // Usando o Azul da DWL para a caneta
											canvasProps={{
												className: "w-full h-full",
											}}
										/>
									</div>
									<p className="text-xs text-dwl-blue/70 dark:text-dwl-grey text-center">
										Assine no quadro acima. Essa assinatura
										será embutida nos relatórios técnicos.
									</p>
								</div>
							</section>

							{/* Área de Segurança */}
							<section>
								<h3 className="text-lg font-bold text-dwl-blue dark:text-dwl-light mb-4 border-b border-app-border pb-2 flex items-center gap-2">
									<Lock className="w-5 h-5 text-dwl-teal" />{" "}
									Atualizar Senha
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
											placeholder="Necessária apenas se for alterar a senha"
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none text-sm"
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
											placeholder="Deixe em branco para manter a atual"
											className="w-full px-3 py-2 border border-app-border rounded-lg bg-transparent text-dwl-blue dark:text-dwl-light focus:ring-1 focus:ring-dwl-teal outline-none text-sm"
										/>
									</div>
								</div>
							</section>

							<div className="pt-4 flex justify-end">
								<button
									onClick={handleSaveProfile}
									disabled={isLoading}
									className="px-6 py-2.5 bg-dwl-teal disabled:opacity-70 text-white rounded-lg text-sm font-medium hover:bg-dwl-teal/90 transition-colors flex items-center gap-2 shadow-sm"
								>
									{isLoading ? (
										"Salvando..."
									) : (
										<>
											<Save className="w-4 h-4" /> Salvar
											Alterações
										</>
									)}
								</button>
							</div>
						</div>
					)}

					{/* ... (Abas EMPRESA e SISTEMA mantidas inalteradas) ... */}
				</div>
			</div>
		</div>
	);
}
