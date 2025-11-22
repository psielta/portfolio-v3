# Portfolio Blog Pessoal

Portfolio pessoal desenvolvido com Next.js, TypeScript, tRPC e Prisma, apresentando um blog para compartilhar conteúdo e um desafio de sistema solar interativo em 3D.

## Sobre o Projeto

Este projeto de portfolio demonstra habilidades em desenvolvimento full-stack moderno, combinando as melhores práticas de desenvolvimento web com tecnologias atuais. O projeto foi criado como uma plataforma pessoal para:

- **Blog Pessoal**: Sistema de blog integrado para publicação de artigos e projetos
- **Sistema Solar 3D**: Desafio técnico de visualização interativa do sistema solar em 3D, demonstrando habilidades em gráficos 3D e interatividade

Este projeto utiliza uma arquitetura monorepo moderna com Turborepo, garantindo escalabilidade e organização do código.

### Funcionalidades Principais

- **Blog com MDX**: Sistema completo de blog com suporte a MDX, filtros por tags e animações
- **Sistema Solar 3D**: Visualização interativa do sistema solar com gráficos 3D
- **Mecânica Orbital**: Visualização de órbitas com cálculos precisos baseados em dados da NASA
- **Arquitetura Monorepo**: Organização modular com Turborepo
- **API Type-Safe**: End-to-end type safety com tRPC
- **Design Moderno**: Interface construída com shadcn/ui e TailwindCSS
- **Tour Interativo**: Wizard de introdução e tour com React Joyride

## Tecnologias Utilizadas

- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Linguagem**: TypeScript 5
- **ORM**: Prisma 7.0.0
- **Banco de Dados**: SQLite/Turso
- **API**: tRPC 11.5.0 (end-to-end type-safe)
- **Estilização**: TailwindCSS 4.1.10
- **UI Components**: shadcn/ui + Radix UI
- **Monorepo**: Turborepo 2.5.4
- **Package Manager**: npm 10.9.3
- **Build Tool**: tsdown (para pacote API)
- **Blog/MDX**: next-mdx-remote-client 2.0.0 (React 19 compatible)
- **Animações**: Framer Motion
- **Tour Guide**: React Joyride

## Estrutura do Projeto

```
portfolio/
├── apps/
│   └── web/                 # Aplicação Next.js (frontend + backend)
│       ├── src/
│       │   ├── app/        # Rotas Next.js (App Router)
│       │   │   └── blog/   # Sistema de blog com MDX
│       │   ├── components/ # Componentes React reutilizáveis
│       │   │   └── blog/   # Componentes específicos do blog
│       │   ├── content/    # Artigos MDX do blog
│       │   │   └── blog/
│       │   └── lib/        # Utilitários e funções auxiliares
│       └── package.json
├── packages/
│   ├── api/                 # Camada de API / lógica de negócio
│   │   ├── src/
│   │   │   └── routers/    # Routers tRPC
│   │   └── package.json
│   ├── db/                  # Schema e queries do banco de dados
│   │   ├── prisma/
│   │   │   └── schema/     # Schema Prisma
│   │   └── package.json
│   └── config/              # Configurações compartilhadas
└── package.json             # Configuração raiz do monorepo
```

## Configuração do Ambiente

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

Atualize o arquivo `.env` no diretório `apps/web` com as configurações necessárias:

```bash
# apps/web/.env
DATABASE_URL="file:./dev.db"
```

### Passo 4: Configurar o Banco de Dados

1. **Gerar o Prisma Client**:
```bash
npm run db:generate
```

2. **Fazer push do schema para criar/atualizar o banco de dados**:
```bash
npm run db:push
```

**Nota:** SQLite não requer um servidor de banco de dados separado - o arquivo do banco de dados é criado automaticamente quando você executa `db:push`.

### Passo 5: Executar o Projeto

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3001](http://localhost:3001).

## Scripts Disponíveis

### Desenvolvimento

- `npm run dev`: Inicia todas as aplicações em modo de desenvolvimento
- `npm run dev:web`: Inicia apenas a aplicação web
- `npm run check-types`: Verifica tipos TypeScript em todos os apps

### Build

- `npm run build`: Compila todas as aplicações para produção

### Banco de Dados

- `npm run db:generate`: Gera o Prisma Client
- `npm run db:push`: Faz push das mudanças do schema para o banco de dados
- `npm run db:migrate`: Executa migrações do banco de dados
- `npm run db:studio`: Abre o Prisma Studio (UI para visualizar/editar dados)

## Troubleshooting

### TypeScript não reconhece novos routers do tRPC

Se você adicionar um novo router no `packages/api/src/routers/` e importá-lo no `appRouter`, mas o TypeScript ainda não reconhecer o tipo (ex: `Property 'cliente' does not exist on type 'TRPCOptionsProxy'`), você precisa reconstruir o pacote `api`:

**Do diretório raiz do projeto:**
```bash
npm run build -- -F @portfolio/api
```

Ou usando npm workspace:
```bash
npm run build --workspace=@portfolio/api
```

Isso acontece porque o tipo `AppRouter` é gerado durante o build do pacote `api`. Após o build, os tipos serão atualizados e o erro desaparecerá.

**Dica:** Se o erro persistir no editor após o build, reinicie o servidor TypeScript:
- VS Code/Cursor: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Script `db:local` não existe

O comando `npm run db:local` mencionado anteriormente não existe mais. SQLite não requer um servidor separado - use `npm run db:generate` seguido de `npm run db:push` conforme documentado na seção de configuração.

## Sistema de Blog

### Características do Blog

O sistema de blog foi desenvolvido com suporte completo a MDX, permitindo:

- **Artigos em MDX**: Escreva artigos com componentes React interativos
- **Filtros por Tags**: Sistema de categorização e filtro dinâmico
- **Animações com Framer Motion**: Transições suaves e interativas
- **SEO Otimizado**: Metadados estruturados para cada artigo
- **Syntax Highlighting**: Suporte para blocos de código com destaque de sintaxe
- **Reading Time**: Cálculo automático do tempo de leitura

### Criando Novos Artigos

Para adicionar um novo artigo ao blog:

1. Crie um arquivo `.mdx` em `apps/web/src/content/blog/`
2. Adicione o frontmatter no início do arquivo:

```mdx
---
title: "Título do Artigo"
description: "Descrição breve do artigo"
publishedAt: "2024-01-01"
author: "Seu Nome"
tags: ["tag1", "tag2"]
featured: true # opcional, para destacar o artigo
---

Conteúdo do artigo em MDX...
```

3. O artigo será automaticamente listado na página do blog

### Componentes MDX Disponíveis

Os artigos MDX têm acesso a componentes customizados para enriquecer o conteúdo:
- Blocos de código com syntax highlighting
- Imagens otimizadas com Next.js Image
- Componentes React personalizados
- Elementos HTML estilizados com Tailwind Typography

## Notas Técnicas

### Arquitetura Monorepo

Este projeto utiliza **Turborepo** para gerenciar múltiplos pacotes em um único repositório:

- **apps/web**: Aplicação Next.js principal
- **packages/api**: Camada de API compartilhada com tRPC
- **packages/db**: Schema e cliente Prisma compartilhado
- **packages/config**: Configurações compartilhadas (TypeScript, ESLint, etc.)

### Type Safety End-to-End

O projeto utiliza **tRPC** para garantir type safety completo desde o backend até o frontend:

- Rotas tRPC são definidas em `packages/api/src/routers/`
- Tipos são gerados automaticamente durante o build
- Frontend importa tipos diretamente do pacote `@portfolio/api`

### Prisma com SQLite

O projeto utiliza Prisma ORM com SQLite para desenvolvimento local:

- Schema definido em `packages/db/prisma/schema/`
- Cliente gerado em `packages/db/prisma/generated/`
- Banco de dados SQLite criado automaticamente no diretório `apps/web/`

### Build do Pacote API

O pacote `@portfolio/api` utiliza `tsdown` para compilação:

- Script de build: `npx tsdown`
- Output: `packages/api/dist/`
- Tipos gerados automaticamente

### Compatibilidade com Next.js 16 e React 19

Este projeto utiliza as versões mais recentes do Next.js (16) e React (19):

- **MDX com React 19**: Utilizamos `next-mdx-remote-client` v2 que é compatível com React 19
- **Turbopack**: Desenvolvimento otimizado com o novo bundler do Next.js
- **Server Components**: Aproveitamento completo do App Router e React Server Components

## Roadmap

### Concluído ✅

- [x] Sistema de blog completo com MDX
- [x] Sistema solar 3D interativo
- [x] Mecânica orbital com visualização 3D
- [x] Tour interativo com Wizard e React Joyride
- [x] Filtros por tags no blog
- [x] Animações com Framer Motion

### Em Desenvolvimento

- [ ] Comentários nos posts do blog
- [ ] Sistema de busca no blog
- [ ] Newsletter/Inscrição por email

### Futuro

- [ ] Integração com CMS headless
- [ ] RSS Feed para o blog
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Deploy automatizado com CI/CD
- [ ] Testes unitários e de integração
- [ ] Analytics e métricas
- [ ] Dark/Light mode toggle

## Contribuindo

Este é um projeto pessoal de portfolio, mas feedbacks são bem-vindos! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está sob licença MIT. Sinta-se livre para usar como referência para seus próprios projetos.

## Autor

Mateus Salgueiro
- GitHub: [@psielta](https://github.com/psielta)
- LinkedIn: [Mateus Salgueiro](https://www.linkedin.com/in/mateus-salgueiro-525717205/)

---

Desenvolvido com ❤️ como parte do meu portfolio de desenvolvimento web full-stack.
