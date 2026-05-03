# 🛠️ DWL Tech Support - Frontend MVP

> Interface web para gestão de assistência técnica e controle de Ordens de Serviço (O.S.), desenvolvida exclusivamente para a **DWL Diagnóstica**.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📌 Sobre o Projeto

Este é o frontend (Minimum Viable Product) do sistema de gerenciamento de assistência técnica da DWL Diagnóstica. Ele oferece um painel de controle ágil e responsivo para que os técnicos possam gerenciar o ciclo de vida completo de uma Ordem de Serviço, desde a entrada do equipamento até a emissão do laudo técnico em PDF.

## ✨ Funcionalidades

- 📊 **Dashboard Gerencial:** Visão 360º com métricas em tempo real de O.S. Pendentes, Concluídas e Canceladas.
- 👥 **Gestão de Clientes:** Cadastro e edição de perfis de clientes, com visualização da "garagem" de equipamentos atrelados a cada perfil.
- 💻 **Controle de Equipamentos:** Registro detalhado de máquinas, números de série e status atual na bancada.
- ⚙️ **Workflow de Ordem de Serviço:**
    - Abertura detalhada com relato do cliente.
    - Mudança de status inteligente (ABERTA, FINALIZADA, CANCELADA).
    - Tratamento de justificativas obrigatórias para cancelamentos.
- 🖨️ **Gerador Nativo de PDF:** Criação de laudos/recibos profissionais diretamente no navegador, sem dependência de bibliotecas externas, prontos para impressão ou envio por WhatsApp.

## 🚀 Tecnologias Utilizadas

- **[React](https://reactjs.org/)** - Biblioteca principal para construção da interface.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança e escalabilidade.
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária e responsiva.
- **[React Router](https://reactrouter.com/)** - Roteamento dinâmico da aplicação (Single Page Application).
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones moderna e limpa.

## 📦 Como rodar o projeto localmente

1. Clone este repositório:

```bash
   git clone [https://github.com/seu-usuario/nome-do-repo.git](https://github.com/seu-usuario/nome-do-repo.git)
```

2. Clone este repositório:

```bash
   cd nome-do-repo
```

3. Instale as dependências:

```bash
  npm install
```

4. Crie um arquivo .env na raiz do projeto e configure a URL da sua API (Backend):

```bash
VITE_API_URL=http://localhost:3333
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```
