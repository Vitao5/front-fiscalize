<![CDATA[<div align="center">

# 💰 Fiscalize Finanças

### Plataforma Web de Gestão Financeira Pessoal

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Flowbite](https://img.shields.io/badge/Flowbite-React-1A56DB?style=for-the-badge&logo=flowbite&logoColor=white)](https://flowbite-react.com/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-F7DF1E?style=for-the-badge&logo=vercel&logoColor=black)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

<br/>

**[Português](#-sobre-o-projeto)** · **[English](#-about-the-project)**

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%"/>

</div>

<br/>

## 🇧🇷 Documentação em Português

<br/>

## 📋 Sobre o Projeto

O **Fiscalize Finanças** é uma plataforma web moderna de gestão financeira pessoal, construída com **Next.js 16** e **React 19**. A aplicação permite que os usuários tenham controle total sobre suas finanças — desde o registro de despesas extras, fixas e parceladas, até a conexão direta com contas bancárias via **Open Finance (Pluggy)**, com dashboards interativos e gráficos em tempo real.

<br/>

## ✨ Funcionalidades Principais

| Recurso | Descrição |
|:---|:---|
| 📊 **Dashboard Interativo** | Painel completo com visão geral das finanças, gráficos e indicadores |
| 🛒 **Despesas Extras** | Registro, edição e exclusão de compras/despesas avulsas |
| 📅 **Despesas Fixas** | Gerenciamento de gastos recorrentes mensais |
| 🔄 **Compras Parceladas** | Controle detalhado de compras parceladas com acompanhamento de parcelas |
| 🏧 **Open Finance** | Conexão bancária via Pluggy para importação automática de extratos |
| 🔐 **Autenticação Segura** | Login com JWT, registro de conta e recuperação de senha |
| 📱 **Design Responsivo** | Interface otimizada para desktop e dispositivos móveis |
| 🌙 **Tema Escuro** | Interface com tema escuro moderno e agradável |
| 📈 **Gráficos Avançados** | Visualizações com ApexCharts e Chart.js |

<br/>

## 🎨 Interface & Componentes

### Layout Principal

| Componente | Descrição |
|:---|:---|
| `AppSidebar` | Barra lateral de navegação colapsável com menu de opções |
| `AppHeader` | Cabeçalho com informações do usuário e ações rápidas |
| `DashboardCard` | Card reutilizável para exibição de métricas e indicadores |

### Modais de Cadastro

| Modal | Descrição |
|:---|:---|
| `ModalDespesa` | Formulário para registro de despesas extras |
| `ModalDespesaFixa` | Formulário para registro de despesas fixas |
| `ModalCompraParcelada` | Formulário para registro de compras parceladas |
| `PluggyOnboardingModal` | Assistente de conexão bancária via Open Finance |
| `Modal` | Componente modal genérico reutilizável |

<br/>

## 🏗️ Arquitetura

```
fiscalize-next/
│
├── 📂 public/                  # Arquivos estáticos (favicon, imagens)
│
├── 📂 src/
│   ├── 📂 app/                 # App Router (Next.js 16)
│   │   ├── 📄 layout.tsx       # Layout raiz da aplicação
│   │   ├── 📄 globals.css      # Estilos globais
│   │   │
│   │   ├── 📂 login/           # Página de login
│   │   ├── 📂 register/        # Página de registro
│   │   ├── 📂 reset-password/  # Recuperação de senha
│   │   │
│   │   └── 📂 dashboard/       # Área principal (autenticada)
│   │       ├── 📄 page.tsx             # Página do dashboard (SSR)
│   │       ├── 📄 layout.tsx           # Layout com sidebar/header
│   │       ├── 📄 dashboard-client.tsx # Lógica client-side do dashboard
│   │       ├── 📄 dashboard-action.ts  # Server Actions
│   │       └── 📄 pluggy-actions.ts    # Server Actions do Pluggy
│   │
│   ├── 📂 components/          # Componentes reutilizáveis
│   │   ├── 📄 AppSidebar.tsx
│   │   ├── 📄 AppHeader.tsx
│   │   ├── 📄 DashboardCard.tsx
│   │   ├── 📄 Modal.tsx
│   │   ├── 📄 ModalDespesa.tsx
│   │   ├── 📄 ModalDespesaFixa.tsx
│   │   ├── 📄 ModalCompraParcelada.tsx
│   │   └── 📄 PluggyOnboardingModal.tsx
│   │
│   ├── 📂 context/             # React Context (estado global)
│   ├── 📂 icons/               # Ícones customizados
│   ├── 📂 lib/                 # Utilitários e helpers
│   ├── 📂 types/               # Definições de tipos TypeScript
│   │
│   ├── 📄 proxy.ts             # Proxy de requisições para a API
│   └── 📄 comum-functions.tsx  # Funções utilitárias compartilhadas
│
├── 📄 next.config.ts           # Configuração do Next.js
├── 📄 tailwind.config.cjs      # Configuração do Tailwind CSS
├── 📄 tsconfig.json            # Configuração do TypeScript
├── 📄 postcss.config.mjs       # Configuração do PostCSS
├── 📄 eslint.config.mjs        # Configuração do ESLint
└── 📄 package.json
```

<br/>

## 🖥️ Páginas da Aplicação

| Rota | Página | Descrição |
|:---|:---|:---|
| `/login` | Login | Autenticação do usuário com e-mail e senha |
| `/register` | Registro | Criação de nova conta |
| `/reset-password` | Recuperar Senha | Fluxo de recuperação com código por e-mail |
| `/dashboard` | Dashboard | Painel principal com visão geral financeira |

<br/>

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 18
- **npm**, **yarn** ou **pnpm**
- **Fiscalize API** rodando ([ver README da API](../Fiscalize-API-V1/README.md))

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/fiscalize-next.git
cd fiscalize-next

# 2. Instale as dependências
npm install
# ou
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### Variáveis de Ambiente

```env
# URL de conexão com o banco de dados (para Server Actions)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Chave secreta para validação de tokens
SECRET_KEY="sua-chave-secreta-aqui"

# URL base da API backend
NEXT_PUBLIC_API_BASE="https://seu-ip:3002/api"
```

### Executar

```bash
# Desenvolvimento (com Turbopack)
npm run dev

# Build de produção
npm run build

# Servir build de produção
npm start

# Lint
npm run lint
```

> 💡 **Dica:** O projeto utiliza **Turbopack** por padrão no modo desenvolvimento para builds ultra-rápidos.

<br/>

## 🛠️ Tecnologias & Dependências

### Core

| Tecnologia | Versão | Propósito |
|:---|:---:|:---|
| Next.js | 16.1 | Framework React com SSR/SSG |
| React | 19.2 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Framework de estilos utility-first |

### UI & Design

| Biblioteca | Propósito |
|:---|:---|
| Flowbite React | Componentes UI pré-construídos |
| Lucide React | Biblioteca de ícones |
| ApexCharts | Gráficos interativos avançados |
| Chart.js | Gráficos e visualizações |
| React Number Format | Formatação de números/moedas |
| clsx + tailwind-merge | Utilitários para classes CSS |

### Integrações

| Biblioteca | Propósito |
|:---|:---|
| react-pluggy-connect | Widget de conexão bancária Pluggy |
| jwt-decode | Decodificação de tokens JWT no client |
| server-only | Garantir código apenas no servidor |

<br/>

## 🔑 Funcionalidades por Tela

### 🔐 Login / Registro

- Formulários com validação
- Autenticação JWT
- Armazenamento seguro de tokens
- Redirecionamento automático

### 🔑 Recuperação de Senha

- Envio de código por e-mail
- Verificação de código
- Redefinição de senha

### 📊 Dashboard

- **Visão Geral**: Saldo total, receitas, despesas do mês
- **Gráficos**: Evolução mensal, distribuição por categoria
- **Despesas Extras**: Lista com filtros, criação, edição, exclusão
- **Despesas Fixas**: Gerenciamento de custos recorrentes
- **Compras Parceladas**: Acompanhamento de parcelas com status
- **Open Finance**: Conexão bancária, visualização de contas e transações

<br/>

---

<br/>

## 🇺🇸 English Documentation

<br/>

## 📋 About the Project

**Fiscalize Finanças** is a modern personal finance management web platform built with **Next.js 16** and **React 19**. The application allows users to have full control over their finances — from tracking extra, fixed, and installment expenses, to connecting directly with bank accounts via **Open Finance (Pluggy)**, with interactive dashboards and real-time charts.

<br/>

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 📊 **Interactive Dashboard** | Complete panel with financial overview, charts, and indicators |
| 🛒 **Extra Expenses** | Register, edit, and delete one-off purchases/expenses |
| 📅 **Fixed Expenses** | Manage recurring monthly expenses |
| 🔄 **Installment Purchases** | Detailed installment purchase tracking with payment follow-up |
| 🏧 **Open Finance** | Bank connection via Pluggy for automatic statement import |
| 🔐 **Secure Authentication** | JWT login, account registration, and password recovery |
| 📱 **Responsive Design** | Interface optimized for desktop and mobile devices |
| 🌙 **Dark Theme** | Modern and pleasant dark-themed interface |
| 📈 **Advanced Charts** | Visualizations with ApexCharts and Chart.js |

<br/>

## 🎨 Interface & Components

### Main Layout

| Component | Description |
|:---|:---|
| `AppSidebar` | Collapsible sidebar navigation with menu options |
| `AppHeader` | Header with user info and quick actions |
| `DashboardCard` | Reusable card for metrics and indicators display |

### Registration Modals

| Modal | Description |
|:---|:---|
| `ModalDespesa` | Form for registering extra expenses |
| `ModalDespesaFixa` | Form for registering fixed expenses |
| `ModalCompraParcelada` | Form for registering installment purchases |
| `PluggyOnboardingModal` | Bank connection wizard via Open Finance |
| `Modal` | Generic reusable modal component |

<br/>

## 🏗️ Architecture

```
fiscalize-next/
│
├── 📂 public/                  # Static files (favicon, images)
│
├── 📂 src/
│   ├── 📂 app/                 # App Router (Next.js 16)
│   │   ├── 📄 layout.tsx       # Root application layout
│   │   ├── 📄 globals.css      # Global styles
│   │   │
│   │   ├── 📂 login/           # Login page
│   │   ├── 📂 register/        # Registration page
│   │   ├── 📂 reset-password/  # Password recovery
│   │   │
│   │   └── 📂 dashboard/       # Main area (authenticated)
│   │       ├── 📄 page.tsx             # Dashboard page (SSR)
│   │       ├── 📄 layout.tsx           # Layout with sidebar/header
│   │       ├── 📄 dashboard-client.tsx # Client-side dashboard logic
│   │       ├── 📄 dashboard-action.ts  # Server Actions
│   │       └── 📄 pluggy-actions.ts    # Pluggy Server Actions
│   │
│   ├── 📂 components/          # Reusable components
│   │   ├── 📄 AppSidebar.tsx
│   │   ├── 📄 AppHeader.tsx
│   │   ├── 📄 DashboardCard.tsx
│   │   ├── 📄 Modal.tsx
│   │   ├── 📄 ModalDespesa.tsx
│   │   ├── 📄 ModalDespesaFixa.tsx
│   │   ├── 📄 ModalCompraParcelada.tsx
│   │   └── 📄 PluggyOnboardingModal.tsx
│   │
│   ├── 📂 context/             # React Context (global state)
│   ├── 📂 icons/               # Custom icons
│   ├── 📂 lib/                 # Utilities and helpers
│   ├── 📂 types/               # TypeScript type definitions
│   │
│   ├── 📄 proxy.ts             # API request proxy
│   └── 📄 comum-functions.tsx  # Shared utility functions
│
├── 📄 next.config.ts           # Next.js configuration
├── 📄 tailwind.config.cjs      # Tailwind CSS configuration
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 postcss.config.mjs       # PostCSS configuration
├── 📄 eslint.config.mjs        # ESLint configuration
└── 📄 package.json
```

<br/>

## 🖥️ Application Pages

| Route | Page | Description |
|:---|:---|:---|
| `/login` | Login | User authentication with email and password |
| `/register` | Register | New account creation |
| `/reset-password` | Password Recovery | Recovery flow with email verification code |
| `/dashboard` | Dashboard | Main panel with financial overview |

<br/>

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, or **pnpm**
- **Fiscalize API** running ([see API README](../Fiscalize-API-V1/README.md))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/fiscalize-next.git
cd fiscalize-next

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit the .env file with your credentials
```

### Environment Variables

```env
# Database connection URL (for Server Actions)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Secret key for token validation
SECRET_KEY="your-secret-key-here"

# Backend API base URL
NEXT_PUBLIC_API_BASE="https://your-ip:3002/api"
```

### Running

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Serve production build
npm start

# Lint
npm run lint
```

> 💡 **Tip:** The project uses **Turbopack** by default in development mode for ultra-fast builds.

<br/>

## 🛠️ Tech Stack & Dependencies

### Core

| Technology | Version | Purpose |
|:---|:---:|:---|
| Next.js | 16.1 | React framework with SSR/SSG |
| React | 19.2 | UI library |
| TypeScript | 5.x | Static typing |
| Tailwind CSS | 4.x | Utility-first CSS framework |

### UI & Design

| Library | Purpose |
|:---|:---|
| Flowbite React | Pre-built UI components |
| Lucide React | Icon library |
| ApexCharts | Advanced interactive charts |
| Chart.js | Charts and visualizations |
| React Number Format | Number/currency formatting |
| clsx + tailwind-merge | CSS class utilities |

### Integrations

| Library | Purpose |
|:---|:---|
| react-pluggy-connect | Pluggy bank connection widget |
| jwt-decode | Client-side JWT token decoding |
| server-only | Ensure server-only code |

<br/>

## 🔑 Features by Screen

### 🔐 Login / Register

- Forms with validation
- JWT authentication
- Secure token storage
- Automatic redirects

### 🔑 Password Recovery

- Email verification code
- Code verification
- Password reset

### 📊 Dashboard

- **Overview**: Total balance, income, monthly expenses
- **Charts**: Monthly evolution, category distribution
- **Extra Expenses**: List with filters, create, edit, delete
- **Fixed Expenses**: Recurring cost management
- **Installment Purchases**: Installment tracking with status
- **Open Finance**: Bank connection, account and transaction viewing

<br/>

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|:---:|:---|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) | React Framework |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Static Typing |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Styling |
| ![Flowbite](https://img.shields.io/badge/Flowbite-1A56DB?style=flat-square&logoColor=white) | UI Components |
| ![ApexCharts](https://img.shields.io/badge/ApexCharts-008FFB?style=flat-square&logoColor=white) | Charts |
| ![Pluggy](https://img.shields.io/badge/Pluggy-00D09C?style=flat-square&logoColor=white) | Open Finance |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Deployment |

</div>

<br/>

---

<div align="center">

**Feito com ❤️ para o Fiscalize Finanças** · **Made with ❤️ for Fiscalize Finanças**

<br/>

[⬆️ Voltar ao topo / Back to top](#-fiscalize-finanças)

</div>
]]>
