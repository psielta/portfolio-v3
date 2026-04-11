# Guia Operacional - Portfolio-v3

## Requisitos da VPS

- Ubuntu 22.04+ (Hostinger ou equivalente)
- Node.js 22 LTS
- 1 GB RAM minimo
- Dominio apontando para o IP da VPS

## Bootstrap da VPS (primeira vez)

```bash
# 1. Criar usuario dedicado
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy

# 2. Instalar Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar ferramentas
sudo npm install -g pm2
sudo apt-get install -y nginx certbot python3-certbot-nginx sqlite3

# 4. Criar estrutura de diretorios
sudo mkdir -p /var/www/portfolio-v3/{app,shared/{data,backups,logs}}
sudo chown -R deploy:deploy /var/www/portfolio-v3

# 5. Clonar repositorio
cd /var/www/portfolio-v3
git clone git@github.com:psielta/portfolio-v3.git app
# Se repo privado: configurar deploy key antes

# 6. Configurar ambiente de producao
cp app/apps/web/.env.production app/apps/web/.env.production
# Editar com valores reais:
nano app/apps/web/.env.production

# 7. Configurar Nginx
sudo cp app/docs/nginx-portfolio.conf /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 8. Certificado SSL (apos dominio apontar para VPS)
sudo certbot --nginx -d SEU_DOMINIO

# 9. Primeiro deploy
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh

# 10. Persistir PM2 apos reboot
pm2 startup
# Executar o comando que o PM2 imprimir
pm2 save

# 11. Agendar backup diario (3h da manha)
crontab -e
# Adicionar: 0 3 * * * /var/www/portfolio-v3/app/scripts/backup-sqlite.sh >> /var/www/portfolio-v3/shared/logs/backup.log 2>&1
```

## Nginx Config

Criar `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO;

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
```

O Certbot adicionara o bloco HTTPS automaticamente.

## Redeploy

```bash
cd /var/www/portfolio-v3/app
bash scripts/deploy.sh
```

O script e idempotente: pode rodar quantas vezes quiser sem efeitos colaterais.

## Comandos uteis

```bash
# Logs em tempo real
pm2 logs portfolio-web

# Status do app
pm2 status

# Restart manual
pm2 restart portfolio-web

# Verificar saude
curl http://127.0.0.1:3001/api/health

# Abrir banco no Prisma Studio (dev apenas)
cd /var/www/portfolio-v3/app && npm run db:studio

# Backup manual
bash scripts/backup-sqlite.sh
```

## Restore de backup

```bash
# 1. Parar o app
pm2 stop portfolio-web

# 2. Restaurar backup
cp /var/www/portfolio-v3/shared/backups/portfolio_YYYYMMDD_HHMMSS.db \
   /var/www/portfolio-v3/shared/data/portfolio.db

# 3. Reiniciar
pm2 start portfolio-web
```

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| 502 Bad Gateway | `pm2 restart portfolio-web` e verificar logs |
| DB locked | Verificar se ha processos com `fuser /var/www/.../portfolio.db` |
| Certificado expirado | `sudo certbot renew` |
| Porta 3001 em uso | `lsof -i :3001` e matar processo |
| Health check falha | Verificar DATABASE_URL e logs do PM2 |
