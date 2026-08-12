#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker no esta instalado." >&2; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "ERROR: Docker Compose no esta disponible." >&2; exit 1; }
[[ -f .env.production ]] || { echo "ERROR: falta web/.env.production. Copia .env.production.example y completa sus valores." >&2; exit 1; }

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "ERROR: el arbol Git tiene cambios locales. Guardalos o commitealos antes de desplegar." >&2
    exit 1
  fi
  current_branch="$(git branch --show-current)"
  git pull --ff-only origin "$current_branch"
fi

docker compose -f docker-compose.aws.yml build
docker compose -f docker-compose.aws.yml up -d
docker compose -f docker-compose.aws.yml ps

health_url="http://127.0.0.1:3000/api/health"
if command -v curl >/dev/null 2>&1; then
  curl --fail-with-body --show-error --silent "$health_url" || {
    echo
    echo "ADVERTENCIA: /api/health no esta listo. Revisa backend y variables Cognito; el contenedor permanece iniciado." >&2
  }
else
  echo "ADVERTENCIA: curl no esta disponible; prueba manualmente $health_url" >&2
fi
