# Despliegue AWS: EC2 + CloudFront

MatchPoint Web requiere un proceso Node.js porque utiliza SSR, Route Handlers, el proxy `/api/backend` y cookies `httpOnly`. No debe desplegarse como sitio estático en S3.

Para ejecutar la configuración en AWS Console paso a paso, usa [AWS_MANUAL_CHECKLIST.md](./AWS_MANUAL_CHECKLIST.md).

## Preparar EC2

Instala Git, Docker Engine y Docker Compose. Clona el repositorio, entra en `web/`, copia `.env.production.example` como `.env.production` y completa los valores reales. El archivo real y las claves `*.pem` están ignorados por Git.

El backend existente debe escuchar en el host EC2 por el puerto 9090. Desde Docker se alcanza mediante `http://host.docker.internal:9090`; `extra_hosts` resuelve ese nombre al gateway del host Linux.

## Desplegar

Ejecuta `bash scripts/deploy-ec2.sh`. El script se detiene si el árbol Git tiene cambios, actualiza únicamente mediante fast-forward, construye la imagen, inicia el servicio y consulta `/api/health`. Un 503 del health indica backend inaccesible o Cognito incompleto; no provoca un ciclo de reinicios.

## CloudFront

Configura manualmente una distribución con:

- Origin: DNS público de EC2, protocolo `HTTP only`, puerto HTTP personalizado `3000`.
- Viewer protocol policy: `Redirect HTTP to HTTPS`.
- Allowed methods: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`.
- Cache policy: `CachingDisabled`.
- Origin request policy: `AllViewer`.

Se deben reenviar las cookies porque la sesión usa `mp_access` y `mp_refresh` como cookies `httpOnly`. No crees una política que elimine cookies ni los encabezados requeridos por los Route Handlers.

## Security Group

No dejes el puerto 3000 abierto permanentemente a `0.0.0.0/0`. Restringe la regla de entrada al AWS-managed prefix list `com.amazonaws.global.cloudfront.origin-facing`. Conserva el acceso administrativo SSH limitado a una IP autorizada. Estas reglas se configuran manualmente en AWS.

## Verificación

Abre `https://<TU_DISTRIBUCION>.cloudfront.net/api/health`. Debe responder 200 cuando el backend sea alcanzable y Cognito esté completo. No publiques Client IDs inventados, claves AWS, tokens, contraseñas ni archivos PEM.
