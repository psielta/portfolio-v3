#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# backup-sqlite.sh - Backup consistente do SQLite via .backup
# Uso: ./scripts/backup-sqlite.sh
# Agendar via cron: 0 3 * * * /var/www/portfolio-v3/app/scripts/backup-sqlite.sh
# ============================================================

DB_PATH="/var/www/portfolio-v3/shared/data/portfolio.db"
BACKUP_DIR="/var/www/portfolio-v3/shared/backups"
RETENTION_DAYS=14
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/portfolio_${TIMESTAMP}.db"

# Verificar se o banco existe
if [ ! -f "$DB_PATH" ]; then
  echo "ERRO: Banco nao encontrado em $DB_PATH"
  exit 1
fi

# Garantir diretorio de backup
mkdir -p "$BACKUP_DIR"

# Backup consistente usando sqlite3 .backup
echo "Iniciando backup: $BACKUP_FILE"
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

# Verificar integridade do backup
INTEGRITY=$(sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;" 2>&1)
if [ "$INTEGRITY" != "ok" ]; then
  echo "ERRO: Backup com problemas de integridade"
  rm -f "$BACKUP_FILE"
  exit 1
fi

# Tamanho do backup
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "OK - Backup criado: $BACKUP_FILE ($SIZE)"

# Limpar backups antigos
REMOVED=$(find "$BACKUP_DIR" -name "portfolio_*.db" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
if [ "$REMOVED" -gt 0 ]; then
  echo "Removidos $REMOVED backups com mais de ${RETENTION_DAYS} dias"
fi
