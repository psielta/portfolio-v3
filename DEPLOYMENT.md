# Deploy em Producao - VPS Ubuntu com PM2

Guia completo para publicar o portfolio em uma VPS Ubuntu (Hostinger ou equivalente) usando PM2, Nginx e HTTPS via Certbot.

## Requisitos

- VPS Ubuntu 22.04+
- Node.js 22+ LTS
- Dominio apontando para o IP da VPS (registro A no DNS)
- Acesso SSH como root ou usuario com sudo
- Se repositorio privado: deploy key configurada no GitHub

## Arquitetura

```
Internet
   |
   v
[Nginx :80/:443] --proxy--> [Next.js :3001 via PM2]
                                    |
                              [SQLite local]
                              /var/www/portfolio-v3/shared/data/portfolio.db
```

Estrutura de diretorios na VPS:

```
/var/www/portfolio-v3/
  app/              <-- codigo (git clone)
  shared/
    data/           <-- banco SQLite (fora do repo)
    backups/        <-- backups diarios
    logs/           <-- logs do PM2
```

## 1. Preparar a VPS

### Instalar dependencias do sistema

```bash
# Node.js 22 LTS (se nao tiver)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Ferramentas
npm install -g pm2 turbo
apt-get install -y nginx certbot python3-certbot-nginx sqlite3
```

### Criar estrutura de diretorios

```bash
mkdir -p /var/www/portfolio-v3/shared/{data,backups,logs}
```

### Clonar o repositorio

```bash
cd /var/www/portfolio-v3
git clone git@github.com:psielta/portfolio-v3.git app
```

Se o repo ja foi clonado direto em `/var/www/portfolio-v3`:

```bash
cd /var/www
mv portfolio-v3 app-tmp
mkdir -p portfolio-v3/shared/{data,backups,logs}
mv app-tmp portfolio-v3/app
```

## 2. Configurar Variaveis de Ambiente

Criar o arquivo `.env.production` em `apps/web/`:

```bash
cd /var/www/portfolio-v3/app
nano apps/web/.env.production
```

Conteudo (preencher com valores reais):

```env
# Better Auth
BETTER_AUTH_SECRET=           # gerar com: openssl rand -base64 32
BETTER_AUTH_URL=https://SEU_DOMINIO
CORS_ORIGIN=https://SEU_DOMINIO
NEXT_PUBLIC_APP_URL=https://SEU_DOMINIO

# Database - caminho absoluto fora do repositorio
DATABASE_URL="file:/var/www/portfolio-v3/shared/data/portfolio.db"

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app-gmail
EMAIL_TO=email-destino@gmail.com

# Ably (Real-time Chat)
ABLY_API_KEY=sua-chave-ably

# Admin (usado no seed para criar usuario admin)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=sua-senha-segura

# Admin User ID (preencher apos rodar seed)
NEXT_PUBLIC_ADMIN_ID=
```

Para gerar o secret do Better Auth:

```bash
openssl rand -base64 32
```

Para a senha de app do Gmail:
1. Acesse https://myaccount.google.com/apppasswords
2. Gere uma senha de app para "Correio"
3. Use essa senha no `EMAIL_PASS`

## 3. Primeiro Deploy

Executar o script de deploy:

```bash
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh
```

O script executa automaticamente:
1. `git fetch + reset --hard` para atualizar o codigo
2. `npm ci` para instalar dependencias
3. `prisma generate` para gerar o client
4. `prisma migrate deploy` para aplicar migrations
5. `db:seed` para criar o usuario admin (idempotente)
6. `next build` para compilar a aplicacao
7. `pm2 startOrReload` para iniciar/reiniciar o app
8. Smoke test no `/api/health`

Esperado no final:

```
OK - Health check passou (HTTP 200)
Deploy concluido com sucesso!
```

## 4. Configurar Nginx

Criar o arquivo de configuracao:

```bash
cat > /etc/nginx/sites-available/portfolio << 'EOF'
server {
    listen 80;
    server_name SEU_DOMINIO www.SEU_DOMINIO;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF
```

Ativar e testar:

```bash
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## 5. Certificado SSL

Apos o dominio estar apontando para a VPS:

```bash
certbot --nginx -d SEU_DOMINIO
```

Para incluir www:

```bash
certbot --nginx -d SEU_DOMINIO -d www.SEU_DOMINIO
```

O Certbot configura renovacao automatica via timer do systemd.

## 6. Persistir PM2 apos Reboot

```bash
pm2 startup
# Executar o comando que o PM2 imprimir (sudo env PATH=...)
pm2 save
```

## 7. Backup Automatico

Agendar backup diario do SQLite as 3h da manha:

```bash
crontab -e
```

Adicionar a linha:

```cron
0 3 * * * /var/www/portfolio-v3/app/scripts/backup-sqlite.sh >> /var/www/portfolio-v3/shared/logs/backup.log 2>&1
```

O script `backup-sqlite.sh`:
- Usa `sqlite3 .backup` para copia consistente (sem corromper)
- Verifica integridade do backup com `PRAGMA integrity_check`
- Remove backups com mais de 14 dias

## Operacoes do Dia a Dia

### Redeploy (atualizar a aplicacao)

```bash
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh
```

O script e idempotente: pode rodar quantas vezes quiser.

### Comandos uteis

```bash
# Logs em tempo real
pm2 logs portfolio-web

# Status do app
pm2 status

# Restart manual
pm2 restart portfolio-web

# Verificar saude
curl http://127.0.0.1:3001/api/health

# Backup manual
bash /var/www/portfolio-v3/app/scripts/backup-sqlite.sh
```

### Obter o NEXT_PUBLIC_ADMIN_ID

Apos o primeiro deploy com seed, consulte o ID do admin:

```bash
cd /var/www/portfolio-v3/app/packages/db
sqlite3 /var/www/portfolio-v3/shared/data/portfolio.db "SELECT id FROM user WHERE isAdmin = 1;"
```

Copie o ID e adicione ao `.env.production`:

```bash
nano /var/www/portfolio-v3/app/apps/web/.env.production
# Preencher: NEXT_PUBLIC_ADMIN_ID=o-id-copiado
```

Depois rode o deploy novamente para aplicar:

```bash
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh
```

### Restore de Backup

```bash
# 1. Parar o app
pm2 stop portfolio-web

# 2. Listar backups disponiveis
ls -lh /var/www/portfolio-v3/shared/backups/

# 3. Restaurar
cp /var/www/portfolio-v3/shared/backups/portfolio_YYYYMMDD_HHMMSS.db \
   /var/www/portfolio-v3/shared/data/portfolio.db

# 4. Reiniciar
pm2 start portfolio-web
```

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| 502 Bad Gateway | `pm2 restart portfolio-web` e verificar `pm2 logs` |
| Health check falha | Verificar DATABASE_URL e `pm2 logs portfolio-web --lines 30` |
| DB locked | `fuser /var/www/portfolio-v3/shared/data/portfolio.db` e matar processo |
| Certificado expirado | `sudo certbot renew` |
| Porta 3001 em uso | `lsof -i :3001` e matar processo |
| Build falha (tsdown) | Verificar se `npm ci` rodou sem `--omit=dev` |
| Seed nao cria admin | Verificar ADMIN_EMAIL e ADMIN_PASSWORD no .env.production |
| `turbo: not found` | `npm install -g turbo` |

## Arquivos de Referencia

| Arquivo | Descricao |
|---------|-----------|
| `ecosystem.config.cjs` | Configuracao do PM2 |
| `scripts/deploy.sh` | Script de deploy idempotente |
| `scripts/backup-sqlite.sh` | Script de backup do SQLite |
| `apps/web/.env.production` | Template de variaveis de producao |
| `apps/web/.env.example` | Template de variaveis de desenvolvimento |
| `docs/ops-guide.md` | Guia operacional detalhado |
