# 💻 @rpg Sistemas - Tech Support Web Portal (v2.0)

Este é o portal web do sistema de gestão de assistência técnica da **@rpg Sistemas**. Uma aplicação Frontend (Single Page Application) moderna, responsiva e focada na melhor experiência de uso (UX) para técnicos e administradores.

A versão 2.0 traz uma interface completamente remodelada, suporte a dashboards interativos, captura de assinatura digital nativa no navegador e atalhos de comunicação direta via WhatsApp.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com ferramentas de ponta para garantir performance e manutenibilidade:

- **React & Vite:** Renderização ultra-rápida e ambiente de desenvolvimento otimizado[cite: 7].
- **TypeScript:** Tipagem estática para um código mais seguro e previsível[cite: 7].
- **Tailwind CSS:** Estilização utilitária para uma interface moderna, responsiva e com suporte nativo a Dark Mode[cite: 7].
- **Lucide React:** Biblioteca de ícones elegantes e consistentes[cite: 7].
- **Axios & JWT Decode:** Comunicação assíncrona segura com a API e decodificação local de tokens de acesso[cite: 7].
- **Recharts:** Renderização de gráficos e dashboards gerenciais[cite: 7].
- **React Signature Canvas:** Captura em tempo real da assinatura física do cliente em dispositivos touch/mouse[cite: 7].

## ⚙️ Funcionalidades e Telas Principais

- **Dashboard Gerencial:** Visão geral da operação com gráficos de status e métricas em tempo real.
- **Painel de O.S. (Kanban/Lista):** Gestão visual das Ordens de Serviço, filtragem por status e histórico de manutenções.
- **Workflow de Fechamento de O.S.:**
    - Modal inteligente para preenchimento de solução aplicada.
    - **Canvas de Assinatura:** Coleta da assinatura do responsável direto na tela.
    - **Botão WhatsApp:** Geração instantânea de mensagens com o link do Laudo em PDF.
- **Gestão de Cadastros:** Telas otimizadas para CRUD de Clientes, Usuários (RBAC) e Equipamentos.

## 🛠️ Como Rodar o Projeto (Local)

1. Clone o repositório e acesse a pasta do frontend.
2. Instale as dependências do projeto:

```bash
npm install
```

3. Crie um arquivo .env na raiz do projeto configurando a URL da API (exemplo):

```bash
VITE_API_URL=http://localhost:3333
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse no seu navegador o endereço padrão (geralmente http://localhost:5173)

### Desenvolvido com ☕ e foco por @rpg Sistemas.
