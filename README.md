# Portfolio Pessoal - Mateus Salgueiro

Portfolio pessoal moderno desenvolvido com Next.js 16, TypeScript, tRPC e Prisma, apresentando um blog técnico, sistema solar interativo em 3D, e páginas dedicadas para ferramentas e entretenimento.

## 🚀 Sobre o Projeto

Este portfolio demonstra habilidades em desenvolvimento full-stack moderno, combinando as melhores práticas de desenvolvimento web com tecnologias atuais. O projeto apresenta:

- **Sistema de Autenticação**: Autenticação completa com better-auth, login/cadastro, gestão de perfil e sistema de roles (admin/usuário)
- **Chat em Tempo Real**: Sistema completo de mensagens instantâneas entre usuários e admin usando Ably (WebSocket)
- **Painel Administrativo**: Interface dedicada para admin gerenciar conversas, visualizar métricas e responder usuários
- **Sistema de Comentários**: Comentários nos posts do blog com threads e likes
- **Blog Técnico com MDX**: Sistema completo de blog para publicação de artigos sobre desenvolvimento
- **Sistema Solar 3D**: Visualização interativa do sistema solar com Three.js
- **Mecânica Orbital**: Simulação precisa de órbitas baseada em dados da NASA
- **Páginas de Lifestyle**: Seções dedicadas para ferramentas de desenvolvimento e entretenimento
- **Sistema de Contato**: Formulário funcional com envio de emails real
- **Tour Interativo**: Wizard de introdução e tour guiado com React Joyride

### ✨ Funcionalidades Principais

- **Autenticação Completa**:
  - Login e cadastro com email/senha
  - Gestão de perfil de usuário
  - Proteção de rotas com better-auth
  - Sessões seguras com cookies httpOnly
  - Dropdown de usuário no header
  - Sistema de roles (usuário/admin)
- **Chat em Tempo Real**:
  - Chat direto com admin usando Ably (WebSocket)
  - Widget de chat flutuante para usuários
  - Painel administrativo para gerenciar conversas
  - Indicadores de digitação em tempo real
  - Contador de mensagens não lidas
  - Marcação automática de mensagens lidas
  - Sistema de presença global (status online/offline do admin)
  - Read receipts em tempo real (confirmação de leitura)
  - Paginação infinita estilo WhatsApp (scroll para carregar mensagens antigas)
  - Input otimista (resposta instantânea ao enviar)
- **Blog com MDX**: Sistema completo com suporte a MDX, filtros por tags e animações
- **Sistema Solar 3D**: Visualização interativa com controles de velocidade e vetores físicos
- **Mecânica Orbital**: Cálculos precisos de órbitas com parâmetros customizáveis
- **Formulário de Contato**: Envio real de emails com Nodemailer e validação com Formik + Yup
- **Páginas de Lifestyle**:
  - **Uses**: Ferramentas e tecnologias utilizadas no dia a dia
  - **Entertainment**: Recomendações de filmes, séries e podcasts
- **Arquitetura Monorepo**: Organização modular com Turborepo
- **API Type-Safe**: End-to-end type safety com tRPC
- **Design Espacial**: Interface com tema espacial, glassmorphism e animações Framer Motion
- **Tour Interativo**: Wizard de introdução e tour com 8 passos

## 🛠 Tecnologias Utilizadas

### Core
- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Linguagem**: TypeScript 5
- **Monorepo**: Turborepo 2.5.4

### Backend
- **ORM**: Prisma 7.0.0
- **Banco de Dados**: SQLite/Turso
- **API**: tRPC 11.5.0 (end-to-end type-safe)
- **Autenticação**: better-auth 1.4.0
- **Email**: Nodemailer
- **Real-time**: Ably (WebSocket)

### Frontend
- **Estilização**: TailwindCSS 4.1.10
- **UI Components**: shadcn/ui + Radix UI
- **Animações**: Framer Motion
- **3D Graphics**: Three.js
- **Formulários**: Formik + Yup
- **Blog/MDX**: next-mdx-remote-client 2.0.0
- **Tour Guide**: React Joyride

### Testes
- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **Environment**: Happy DOM

## 📁 Estrutura do Projeto

```
portfolio/
├── apps/
│   └── web/                 # Aplicação Next.js (frontend + backend)
│       ├── src/
│       │   ├── app/        # Rotas Next.js (App Router)
│       │   │   ├── about/           # Página sobre mim
│       │   │   ├── admin/           # Painel administrativo
│       │   │   │   └── chat/        # Gerenciamento de conversas
│       │   │   ├── blog/            # Sistema de blog com MDX
│       │   │   ├── contact/         # Formulário de contato
│       │   │   ├── entertainment/   # Recomendações de mídia
│       │   │   ├── orbits/          # Mecânica orbital
│       │   │   ├── projects/        # Projetos
│       │   │   ├── uses/            # Ferramentas e tecnologias
│       │   │   ├── wizard/          # Tour guiado
│       │   │   ├── login/           # Página de login
│       │   │   ├── signup/          # Página de cadastro
│       │   │   ├── profile/         # Página de perfil do usuário
│       │   │   ├── forgot-password/ # Recuperação de senha
│       │   │   ├── reset-password/  # Redefinir senha
│       │   │   └── api/
│       │   │       ├── auth/        # API de autenticação
│       │   │       ├── chat/        # API de chat real-time (Ably tokens)
│       │   │       └── contact/     # API de envio de email
│       │   ├── components/      # Componentes React
│       │   │   ├── ui/         # Componentes UI reutilizáveis
│       │   │   ├── auth/       # Componentes de autenticação
│       │   │   ├── blog/       # Componentes do blog
│       │   │   ├── chat/       # Componentes de chat em tempo real
│       │   │   └── user-menu.tsx # Menu dropdown do usuário
│       │   ├── lib/            # Utilitários e configurações
│       │   │   ├── auth-client.ts  # Cliente de autenticação
│       │   │   ├── ably-client.ts  # Cliente Ably (WebSocket)
│       │   │   └── email/          # Sistema de envio de emails
│       │   ├── content/        # Artigos MDX do blog
│       │   └── test/           # Configuração de testes
│       └── package.json
├── packages/
│   ├── api/                 # Camada de API / lógica de negócio
│   │   └── src/routers/
│   │       └── chat.ts      # Router tRPC para chat (endpoints protegidos)
│   ├── auth/                # Configuração de autenticação
│   │   └── src/index.ts     # Configuração better-auth com roles
│   ├── db/                  # Schema e queries do banco de dados
│   │   └── prisma/
│   │       ├── schema/
│   │       │   ├── auth.prisma    # Schema de autenticação (User, Session, Account)
│   │       │   └── chat.prisma    # Schema de chat (Conversation, Message)
│   │       └── seed.ts            # Seed para criar usuário admin
│   └── config/              # Configurações compartilhadas
└── package.json             # Configuração raiz do monorepo
```

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- **Node.js**: Versão 18 ou superior
- **npm**: Versão 10.9.3 ou superior
- **Git**: Para clonar o repositório

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/psielta/portfolio-v3.git
cd portfolio
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` em `apps/web/` baseado no `.env.example`:

```bash
# apps/web/.env.local

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001

# Database
DATABASE_URL="file:./dev.db"

# Configuração de Email (opcional - para formulário de contato)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_TO=email-destino@gmail.com

# Ably Configuration (Real-time Chat)
# Get your API key from: https://ably.com/dashboard
ABLY_API_KEY=your-ably-api-key

# Admin Configuration
# The admin user will be automatically created when running prisma seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Admin User ID (for real-time presence tracking)
# Get this from database after running seed (use prisma studio)
NEXT_PUBLIC_ADMIN_ID=your-admin-user-id
```

**Notas importantes**:

1. **Email** (opcional - para formulário de contato):
   - Crie uma senha de app no Google (não use sua senha normal)
   - Configure as variáveis EMAIL_*

2. **Ably** (necessário para chat em tempo real):
   - Crie uma conta gratuita em [ably.com](https://ably.com)
   - Copie sua API key do dashboard
   - Configure a variável ABLY_API_KEY

3. **Admin** (cria usuário admin automaticamente):
   - Configure ADMIN_EMAIL e ADMIN_PASSWORD
   - Será criado automaticamente ao rodar o seed

4. **Admin ID** (necessário para status online do admin):
   - Após rodar o seed, abra o Prisma Studio (`npm run db:studio`)
   - Copie o ID do usuário admin da tabela `User`
   - Configure a variável `NEXT_PUBLIC_ADMIN_ID`
   - Isso permite que usuários vejam quando o admin está online

### Passo 4: Configurar o Banco de Dados

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar/atualizar o banco de dados
npm run db:push

# Criar usuário admin (opcional, mas recomendado)
npm run db:seed
```

### Passo 5: Executar o Projeto

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3001](http://localhost:3001).

## 📝 Scripts Disponíveis

### Desenvolvimento

- `npm run dev`: Inicia todas as aplicações em modo de desenvolvimento
- `npm run dev:web`: Inicia apenas a aplicação web
- `npm run check-types`: Verifica tipos TypeScript

### Build

- `npm run build`: Compila todas as aplicações para produção

### Banco de Dados

- `npm run db:generate`: Gera o Prisma Client
- `npm run db:push`: Sincroniza schema com o banco
- `npm run db:migrate`: Executa migrações
- `npm run db:studio`: Abre interface visual do banco
- `npm run db:seed`: Cria usuário admin (requer ADMIN_EMAIL e ADMIN_PASSWORD no .env)

### Testes

- `npm run test`: Executa testes unitários
- `npm run test:ui`: Executa testes com interface visual
- `npm run test:coverage`: Gera relatório de cobertura

## 🎨 Páginas e Funcionalidades

### 🔐 Autenticação
Sistema completo de autenticação com:
- **Login** (`/login`): Autenticação com email e senha
- **Cadastro** (`/signup`): Criação de nova conta com validação robusta
- **Perfil** (`/profile`): Edição de dados do usuário (protegida)
- **Recuperação de Senha** (`/forgot-password` e `/reset-password`): Fluxo completo de reset
- **Proteção de Rotas**: Páginas protegidas redirecionam para login
- **UserMenu**: Dropdown no header mostrando status de autenticação
- **Sistema de Roles**: Diferenciação entre usuário comum e admin

### 💬 Chat em Tempo Real
Sistema de mensagens instantâneas entre usuários e admin:
- **Widget de Chat**: Botão flutuante para iniciar conversas (usuários autenticados)
- **Painel Admin** (`/admin/chat`): Interface para gerenciar todas as conversas (admin only)
- **Mensagens Real-time**: Comunicação instantânea via Ably WebSocket
- **Indicadores**: Digitação em tempo real e status de presença
- **Notificações**: Contador de mensagens não lidas
- **Histórico**: Todas as mensagens são persistidas no banco

### 🏠 Home
Sistema solar 3D interativo com controles de velocidade, zoom e visualização de vetores físicos.

### 📝 Blog
Sistema de blog com suporte a MDX, filtros por tags, syntax highlighting e cálculo de tempo de leitura.

### 📂 Projetos
Galeria de projetos com descrições, tecnologias utilizadas e links para repositórios.

### 👤 Sobre
Página detalhada com:
- Biografia e experiência profissional
- Timeline interativa de carreira
- Habilidades técnicas organizadas por categoria
- Projetos em destaque

### 🛠 Uses
Ferramentas e tecnologias organizadas em categorias:
- Development Tools
- Design
- Produtividade
- Deploy & DevOps

### 🎬 Entertainment
Recomendações pessoais de:
- Filmes
- Séries
- Podcasts
- Documentários

### 📬 Contato
Formulário funcional com:
- Validação em tempo real com Formik + Yup
- Envio de emails real via SMTP
- Email de confirmação automático
- Design moderno com glassmorphism

### 🚀 Wizard
Tour guiado interativo apresentando todas as funcionalidades do portfolio.

### 🪐 Órbitas
Visualização de mecânica orbital com parâmetros customizáveis e cálculos baseados em dados da NASA.

## 🧪 Testes

O projeto inclui testes unitários para componentes críticos:

```bash
# Executar testes
npm run test

# Testes com interface visual
npm run test:ui

# Cobertura de testes
npm run test:coverage
```

## 💬 Sistema de Chat em Tempo Real

O portfolio inclui um sistema completo de chat em tempo real entre usuários e admin:

### Funcionalidades

- **Widget de Chat**: Botão flutuante disponível para usuários autenticados
- **Comunicação Real-time**: Mensagens instantâneas usando Ably (WebSocket)
- **Painel Admin**: Interface dedicada para gerenciar todas as conversas
- **Indicadores de Digitação**: Mostra quando alguém está digitando
- **Status de Presença Global**: Indica se o admin está online (via canal `presence:admin`)
- **Mensagens Não Lidas**: Contador de mensagens não lidas
- **Marcação Automática**: Mensagens marcadas como lidas ao abrir a conversa
- **Read Receipts**: Confirmação de leitura em tempo real via broadcast Ably
- **Paginação Infinita**: Carregamento de mensagens antigas ao rolar para cima (estilo WhatsApp)
- **Input Otimista**: Limpa o campo imediatamente ao enviar (UI responsiva)

### Arquitetura

```
┌─────────────────┐         ┌─────────────┐         ┌──────────────┐
│  User (Widget)  │ ◄─────► │ Ably Server │ ◄─────► │ Admin Panel  │
└─────────────────┘         └─────────────┘         └──────────────┘
        │                                                    │
        └──────────────────┬────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  tRPC API   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Prisma    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    └─────────────┘
```

### Configuração

1. Crie uma conta gratuita no [Ably](https://ably.com)
2. Copie sua API key do dashboard
3. Configure a variável `ABLY_API_KEY` no `.env.local`
4. O sistema estará pronto para uso!

### Como Usar

**Para usuários**:
- Faça login no sistema
- Clique no ícone de chat flutuante no canto inferior direito
- Envie mensagens diretamente para o admin

**Para admin**:
- Faça login com a conta admin (criada via seed)
- Acesse `/admin/chat` para ver todas as conversas
- Selecione uma conversa para responder
- Veja indicadores de presença e mensagens não lidas

### Estrutura do Banco de Dados

O sistema de chat utiliza dois modelos principais (packages/db/prisma/schema/chat.prisma):

**Conversation** (Conversa):
- `id`: ID único da conversa
- `userId`: Referência ao usuário que iniciou
- `isAdminChat`: Flag indicando conversa com admin
- `lastMessageAt`: Timestamp da última mensagem (para ordenação)
- `isDeleted`: Soft delete

**Message** (Mensagem):
- `id`: ID único da mensagem
- `content`: Conteúdo da mensagem (max 2000 caracteres)
- `conversationId`: Referência à conversa
- `senderId`: Referência ao usuário que enviou
- `status`: Status da mensagem (SENT, DELIVERED, READ)
- `readAt`: Timestamp de quando foi lida
- `isDeleted`: Soft delete

### Endpoints tRPC

O router de chat (packages/api/src/routers/chat.ts) expõe os seguintes endpoints:

**Usuários autenticados**:
- `getOrCreateConversation`: Busca ou cria conversa com admin
- `sendMessage`: Envia uma mensagem
- `markAsRead`: Marca mensagens como lidas
- `getUnreadCount`: Conta mensagens não lidas
- `getMessages`: Busca mensagens com paginação cursor-based

**Admin only**:
- `getAllConversations`: Lista todas as conversas
- `getConversationById`: Busca conversa específica
- `getAdminUnreadCount`: Conta total de mensagens não lidas

### Segurança

O sistema implementa múltiplas camadas de segurança:

1. **Autenticação**: Todos os endpoints são protegidos por `protectedProcedure` do tRPC
2. **Autorização**: Verificação de roles para endpoints admin
3. **Validação**: Input validado com Zod (limite de 2000 caracteres por mensagem)
4. **Verificação de Acesso**: Usuários só podem acessar suas próprias conversas
5. **Token Ably**: Gerado server-side com permissões específicas por usuário
6. **CORS**: Configurado via `CORS_ORIGIN` no better-auth

## 📧 Sistema de Contato

O formulário de contato envia emails reais usando Nodemailer. Para configurar:

1. Crie uma senha de app no Google (Configurações > Segurança > Senhas de app)
2. Configure as variáveis de ambiente EMAIL_*
3. O sistema enviará:
   - Email principal para você com os dados do formulário
   - Email de confirmação para o remetente

## 👑 Sistema de Admin

O portfolio possui um sistema de roles com permissões de admin:

### Criação do Admin

O usuário admin é criado automaticamente ao executar o seed do banco:

```bash
# Configure no .env.local:
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Execute o seed:
npm run db:seed
```

O seed utiliza o **better-auth** para criar o usuário (packages/db/prisma/seed.ts:75-99), garantindo:
- Hash de senha compatível com o sistema de autenticação
- Estrutura correta de Account e User
- Flag `isAdmin: true` configurada
- Email verificado automaticamente

### Funcionalidades Admin

- **Painel de Chat**: Acesso a todas as conversas em `/admin/chat`
- **Gerenciamento de Conversas**: Visualizar e responder múltiplas conversas
- **Métricas**: Contador total de mensagens não lidas
- **API Protegida**: Endpoints exclusivos para admin no tRPC (packages/api/src/routers/chat.ts:206-330)

## 🎯 Troubleshooting

### TypeScript não reconhece novos routers do tRPC

```bash
npm run build -- -F @portfolio/api
# Reinicie o servidor TypeScript no editor
```

### Chat não conecta / Mensagens não aparecem

Verifique se:
- A variável `ABLY_API_KEY` está configurada corretamente
- Você está autenticado no sistema
- O console do navegador não mostra erros de conexão WebSocket
- Teste a conexão Ably em: https://ably.com/dashboard

### Admin não consegue acessar /admin/chat

Verifique se:
- O seed foi executado com sucesso (`npm run db:seed`)
- Você está logado com a conta admin (email configurado em `ADMIN_EMAIL`)
- A flag `isAdmin` está `true` no banco de dados (verifique com `npm run db:studio`)

### Erro ao enviar email

Verifique se:
- As variáveis de ambiente estão configuradas
- A senha de app do Google está correta (não use sua senha normal)
- O EMAIL_SECURE está como "true" (string)

### Build falha com erro de tipos

```bash
npm run check-types
npm run build
```

### Seed não cria o usuário admin

Verifique se:
- As variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão no `.env.local`
- O arquivo está em `apps/web/.env.local`
- Execute `npm run db:seed` novamente
- Veja os logs para entender o erro

## 🚀 Deploy

O projeto inclui setup completo para deploy em VPS Ubuntu com PM2 + Nginx + HTTPS.

Consulte o guia completo em **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

Resumo rapido:

```bash
# Na VPS, apos clonar e configurar .env.production:
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh
```

**Arquivos de operacao incluidos**:
- `ecosystem.config.cjs` - Configuracao PM2
- `scripts/deploy.sh` - Deploy idempotente com smoke test
- `scripts/backup-sqlite.sh` - Backup diario do SQLite
- `docs/ops-guide.md` - Guia operacional
- `GET /api/health` - Health check (app + banco)

## 📈 Roadmap

### Concluído ✅

- [x] Sistema de autenticação completo (better-auth)
- [x] Sistema de roles (usuário/admin)
- [x] Chat em tempo real com Ably (WebSocket)
- [x] Painel administrativo para gerenciar conversas
- [x] Sistema de comentários nos posts do blog
- [x] Sistema de blog completo com MDX
- [x] Sistema solar 3D interativo
- [x] Mecânica orbital com visualização 3D
- [x] Tour interativo com Wizard
- [x] Páginas Uses e Entertainment
- [x] Formulário de contato funcional
- [x] Testes unitários
- [x] Timeline de experiência profissional
- [x] Gestão de perfil de usuário
- [x] Proteção de rotas
- [x] Seed automático para usuário admin

### Em Desenvolvimento

- [ ] Sistema de busca global
- [ ] Newsletter/Inscrição por email
- [ ] Analytics e métricas
- [ ] Notificações push para novas mensagens

### Futuro

- [ ] Integração com CMS headless
- [ ] RSS Feed para o blog
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] CI/CD completo
- [ ] Mais cobertura de testes

## 🤝 Contribuindo

Este é um projeto pessoal de portfolio, mas feedbacks são bem-vindos! Sinta-se à vontade para:
- Abrir issues com sugestões
- Enviar pull requests
- Usar como referência para seu próprio portfolio

## 📄 Licença

Este projeto está sob licença MIT. Sinta-se livre para usar como referência para seus próprios projetos.

## 👨‍💻 Autor

**Mateus Salgueiro**
- GitHub: [@psielta](https://github.com/psielta)
- LinkedIn: [Mateus Salgueiro](https://www.linkedin.com/in/mateus-salgueiro-525717205/)

---

Desenvolvido com ❤️ utilizando as mais modernas tecnologias web.
