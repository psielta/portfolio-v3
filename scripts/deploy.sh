#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# deploy.sh - Deploy idempotente do portfolio-v3
# Uso: ./scripts/deploy.sh
# ============================================================

APP_DIR="/var/www/portfolio-v3/app"
SHARED_DIR="/var/www/portfolio-v3/shared"
BRANCH="master"
HEALTH_URL="http://127.0.0.1:3001/api/health"

echo "================================================"
echo " Deploy portfolio-v3 - $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

# 1. Garantir estrutura de diretorios
mkdir -p "$SHARED_DIR"/{data,backups,logs}

# 2. Atualizar codigo
cd "$APP_DIR"
echo "[1/7] Atualizando codigo..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 3. Instalar dependencias (ci = limpo, sem alterar lock)
echo "[2/7] Instalando dependencias..."
npm ci --omit=dev 2>&1 | tail -3

# 4. Gerar Prisma Client
echo "[3/7] Gerando Prisma Client..."
npm run db:generate 2>&1 | tail -3

# 5. Aplicar migrations
echo "[4/7] Aplicando migrations..."
npm run db:migrate:deploy 2>&1 | tail -5

# 6. Seed (idempotente - so cria admin se nao existir)
echo "[5/7] Executando seed..."
npm run db:seed 2>&1 | tail -3

# 7. Build
echo "[6/7] Construindo aplicacao..."
npm run build 2>&1 | tail -5

# 8. Reiniciar PM2
echo "[7/7] Reiniciando PM2..."
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

# 9. Smoke test
echo ""
echo "Aguardando app iniciar..."
sleep 3

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "OK - Health check passou (HTTP $STATUS)"
else
  echo "FALHA - Health check retornou HTTP $STATUS"
  echo "Verifique logs: pm2 logs portfolio-web --lines 30"
  exit 1
fi

echo ""
echo "Deploy concluido com sucesso!"
echo "================================================"
