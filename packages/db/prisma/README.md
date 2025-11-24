# Database Seeding

Este diretório contém o script de seed para popular o banco de dados com dados iniciais.

## Configuração

### 1. Configure as variáveis de ambiente

Adicione ao seu `.env.local` em `apps/web/`:

```env
ADMIN_EMAIL=seu-email@example.com
ADMIN_PASSWORD=sua-senha-segura
```

### 2. Execute o seed

Existem duas formas de executar o seed:

#### Opção 1: Manualmente

```bash
# Na raiz do projeto
npm run db:seed --workspace=@portfolio/db
```

#### Opção 2: Automaticamente com migrations

O seed é executado automaticamente quando você roda:

```bash
npm run db:migrate --workspace=@portfolio/db
```

## O que o seed faz?

1. **Verifica** se já existe um usuário com o email `ADMIN_EMAIL`
2. **Cria** um novo usuário admin se não existir
3. **Atualiza** o flag `isAdmin` se o usuário já existe mas não é admin
4. **Cria** uma conta credential com a senha hasheada

## Segurança

- A senha é hasheada usando `bcryptjs` antes de ser armazenada
- O usuário admin tem acesso total ao painel administrativo
- Certifique-se de usar uma senha forte em produção
- Nunca commite o `.env.local` no git

## Estrutura criada

```
User {
  email: ADMIN_EMAIL
  name: "Admin"
  emailVerified: true
  isAdmin: true
}

Account {
  providerId: "credential"
  password: <hashed>
}
```

## Troubleshooting

### Erro: "ADMIN_EMAIL or ADMIN_PASSWORD not set"

Certifique-se de que as variáveis estão definidas em `apps/web/.env.local`

### Erro: "Cannot find module bcryptjs"

Execute `npm install` na raiz do projeto

### Admin não consegue fazer login

Verifique se:
1. O email está correto no `.env.local`
2. A senha está correta no `.env.local`
3. O seed foi executado com sucesso (verifique os logs)
