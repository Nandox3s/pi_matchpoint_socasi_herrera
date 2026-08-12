# Despliegue del frontend en EC2

## Requisitos

- Docker y Docker Compose instalados.
- Repositorio clonado en EC2.
- App Client público de Cognito, sin secret.
- Nginx existente con acceso a 127.0.0.1:3000.

## Variables

~~~bash
cd deployment
cp .env.frontend.example .env.frontend
nano .env.frontend
~~~

Completar COGNITO_APP_CLIENT_ID y COGNITO_USER_POOL_ID. El archivo real está ignorado por Git.

## Construcción y arranque

~~~bash
git switch main
git pull --ff-only origin main
docker compose -f deployment/frontend-compose.yml config
docker compose -f deployment/frontend-compose.yml up -d --build
docker compose -f deployment/frontend-compose.yml ps
docker compose -f deployment/frontend-compose.yml logs --tail=100 frontend
curl -i http://127.0.0.1:3000/api/health
~~~

La aplicación solo publica el puerto 3000 en loopback. Nginx debe terminar TLS y reenviar el dominio público usando deployment/nginx-frontend.conf.example.

## Actualización y reversión

Antes de actualizar, registrar el commit estable actual. Para revertir, cambiar a ese tag o commit y reconstruir el contenedor. No guardar credenciales dentro de la imagen ni del repositorio.
