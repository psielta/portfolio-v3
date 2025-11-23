# Portfolio Pessoal - Mateus Salgueiro

Portfolio pessoal moderno desenvolvido com Next.js 16, TypeScript, tRPC e Prisma, apresentando um blog técnico, sistema solar interativo em 3D, e páginas dedicadas para ferramentas e entretenimento.

## 🚀 Sobre o Projeto

Este portfolio demonstra habilidades em desenvolvimento full-stack moderno, combinando as melhores práticas de desenvolvimento web com tecnologias atuais. O projeto apresenta:

- **Sistema de Autenticação**: Autenticação completa com better-auth, login/cadastro e gestão de perfil
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
│       │   │       └── contact/     # API de envio de email
│       │   ├── components/      # Componentes React
│       │   │   ├── ui/         # Componentes UI reutilizáveis
│       │   │   ├── auth/       # Componentes de autenticação
│       │   │   ├── blog/       # Componentes do blog
│       │   │   └── user-menu.tsx # Menu dropdown do usuário
│       │   ├── lib/            # Utilitários e configurações
│       │   │   ├── auth-client.ts  # Cliente de autenticação
│       │   │   └── email/          # Sistema de envio de emails
│       │   ├── content/        # Artigos MDX do blog
│       │   └── test/           # Configuração de testes
│       └── package.json
├── packages/
│   ├── api/                 # Camada de API / lógica de negócio
│   ├── auth/                # Configuração de autenticação
│   ├── db/                  # Schema e queries do banco de dados
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
DATABASE_URL="file:./dev.db"

# Configuração de Email (opcional - para formulário de contato)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_TO=email-destino@gmail.com
```

**Nota**: Para o formulário de contato funcionar, você precisa:
1. Criar uma senha de app no Google (não use sua senha normal)
2. Configurar as variáveis de email acima

### Passo 4: Configurar o Banco de Dados

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar/atualizar o banco de dados
npm run db:push
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

## 📧 Sistema de Contato

O formulário de contato envia emails reais usando Nodemailer. Para configurar:

1. Crie uma senha de app no Google (Configurações > Segurança > Senhas de app)
2. Configure as variáveis de ambiente EMAIL_*
3. O sistema enviará:
   - Email principal para você com os dados do formulário
   - Email de confirmação para o remetente

## 🎯 Troubleshooting

### TypeScript não reconhece novos routers do tRPC

```bash
npm run build -- -F @portfolio/api
# Reinicie o servidor TypeScript no editor
```

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

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente no seu provedor de hospedagem
2. Execute o build:
```bash
npm run build
```
3. Inicie a aplicação:
```bash
npm start
```

Recomendado para deploy:
- Vercel (configuração automática para Next.js)
- Railway
- Render

## 📈 Roadmap

### Concluído ✅

- [x] Sistema de autenticação completo (better-auth)
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

### Em Desenvolvimento

- [ ] Comentários nos posts do blog
- [ ] Sistema de busca global
- [ ] Newsletter/Inscrição por email
- [ ] Analytics e métricas

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
