# Checklist manual de AWS para MatchPoint Web

Usa valores reales obtenidos de AWS. Nunca pegues contraseñas, tokens, claves AWS ni el contenido de la llave PEM en Git, capturas o documentación.

## FASE A — GitHub

- [ ] Abrir el Pull Request `feature/aws-web-deployment` → `develop` y revisar sus cambios.
- [ ] Confirmar que los checks del PR pasan.
- [ ] Fusionar únicamente después de la revisión del equipo.
- [ ] Decidir aparte cuándo promover `develop` a `main`; no asumir que `main` ya contiene esta preparación.

## FASE B — Cognito

- [ ] En AWS Console → Cognito → User pools, abrir el pool real de MatchPoint.
- [ ] Anotar la región, el User Pool ID y el App Client ID.
- [ ] Confirmar que el App Client es público, sin client secret, y admite `ALLOW_USER_AUTH` y `REFRESH_TOKEN_AUTH`.
- [ ] Confirmar que existen los grupos `PLAYER` y `MANAGER` y que los usuarios de prueba pertenecen al grupo correcto.
- [ ] No guardar usuarios ni contraseñas en `.env.production`.

Datos que se usarán después:

```text
Región: <TU_VALOR>
App Client ID: <COGNITO_APP_CLIENT_ID>
User Pool ID: <COGNITO_USER_POOL_ID>
```

## FASE C — EC2

- [ ] AWS Console → EC2 → Instances → seleccionar la instancia MatchPoint.
- [ ] Anotar `Public IPv4`, `Public IPv4 DNS` y el Security Group asociado.
- [ ] Pulsar **Connect** y confirmar el usuario SSH mostrado por AWS; no asumir `ubuntu` ni `ec2-user`.
- [ ] Confirmar que la llave `<TU_LLAVE.pem>` corresponde a esa instancia.

Desde PowerShell:

```powershell
ssh -i "<TU_LLAVE.pem>" <SSH_USER>@<EC2_PUBLIC_IP>
```

Antes del frontend, comprobar el backend dentro de EC2:

```bash
docker ps
curl -i http://localhost:9090/health
curl -i http://localhost:9090/matchpoint/courts
```

Si el backend no responde correctamente, **DETENER DESPLIEGUE FRONTEND**.

## FASE D — Variables

Si el repositorio no existe:

```bash
cd ~
git clone https://github.com/Nandox3s/pi_matchpoint_socasi_herrera.git
cd pi_matchpoint_socasi_herrera
git switch feature/aws-web-deployment
```

Si ya existe:

```bash
cd ~/pi_matchpoint_socasi_herrera
git status
git switch feature/aws-web-deployment
git pull --ff-only origin feature/aws-web-deployment
```

Si `git status` muestra cambios, detenerse y revisarlos. No usar `git reset --hard` ni `git clean -fd`.

Crear las variables locales del servidor:

```bash
cd ~/pi_matchpoint_socasi_herrera/web
cp .env.production.example .env.production
nano .env.production
```

Contenido esperado:

```env
API_BASE_URL=http://host.docker.internal:9090
COGNITO_REGION=<TU_VALOR>
COGNITO_APP_CLIENT_ID=<COGNITO_APP_CLIENT_ID>
COGNITO_USER_POOL_ID=<COGNITO_USER_POOL_ID>
```

- [ ] Confirmar que `.env.production` no contiene passwords, JWT ni claves AWS.
- [ ] Ejecutar `git check-ignore .env.production` y comprobar que Git lo ignora.

## FASE E — Docker frontend

```bash
cd ~/pi_matchpoint_socasi_herrera/web
bash scripts/deploy-ec2.sh
docker compose -f docker-compose.aws.yml ps
docker compose -f docker-compose.aws.yml logs --tail=100 matchpoint-web
curl -i http://localhost:3000
curl -i http://localhost:3000/api/health
```

Resultados esperados con backend y Cognito configurados:

```text
/            → HTTP 200
/api/health  → HTTP 200 y "ok": true
```

## FASE F — Security Group

- [ ] Permitir SSH solo desde la IP administrativa autorizada.
- [ ] Permitir TCP 3000 hacia EC2 desde el AWS-managed prefix list `com.amazonaws.global.cloudfront.origin-facing`.
- [ ] No dejar permanentemente TCP 3000 abierto a `0.0.0.0/0`.
- [ ] No modificar las reglas necesarias para el backend sin coordinación con su responsable.

## FASE G — CloudFront

Crear manualmente una distribución con:

```text
Origin Domain: <EC2_PUBLIC_DNS>
Origin Protocol: HTTP only
Origin Port: 3000
Viewer Protocol Policy: Redirect HTTP to HTTPS
Allowed Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
Cache Policy: CachingDisabled
Origin Request Policy: AllViewer
```

`CachingDisabled` y `AllViewer` son necesarios porque Next.js entrega contenido dinámico, recibe métodos de escritura y usa las cookies `mp_access` y `mp_refresh`.

- [ ] Esperar hasta que el estado de la distribución sea **Deployed**.
- [ ] Anotar el dominio `<CLOUDFRONT_DOMAIN>`.

## FASE H — Prueba final

```text
https://<CLOUDFRONT_DOMAIN>/api/health
https://<CLOUDFRONT_DOMAIN>/
```

- [ ] `/api/health` devuelve HTTP 200 y `ok: true`.
- [ ] La portada carga por HTTPS.
- [ ] En DevTools → Application → Cookies, `mp_access` y `mp_refresh` aparecen como `HttpOnly` y `Secure`; no revelar su contenido.

PLAYER:

- [ ] Login.
- [ ] Canchas y detalle.
- [ ] Crear reserva.
- [ ] Mis reservas.
- [ ] Torneos.
- [ ] Perfil.
- [ ] Logout.

MANAGER:

- [ ] Login.
- [ ] Canchas.
- [ ] Crear y editar cancha.
- [ ] Torneos.
- [ ] Partidos.
- [ ] Perfil.
- [ ] Logout.

## FASE I — Evidencias

Guardar capturas reales, sin secretos ni contenido de cookies, con estos nombres:

- [ ] `01_ec2_running`
- [ ] `02_backend_health_200`
- [ ] `03_frontend_container_running`
- [ ] `04_frontend_local_3000`
- [ ] `05_frontend_health_200`
- [ ] `06_security_group`
- [ ] `07_cloudfront_origin`
- [ ] `08_cloudfront_deployed`
- [ ] `09_cloudfront_health`
- [ ] `10_login_player`
- [ ] `11_player_dashboard`
- [ ] `12_login_manager`
- [ ] `13_manager_dashboard`
- [ ] `14_docker_logs`
- [ ] `15_architecture`

Datos que Fernando debe tener a mano:

```text
EC2 Public IP: <EC2_PUBLIC_IP>
EC2 Public DNS: <EC2_PUBLIC_DNS>
SSH user: <SSH_USER>
PEM key: <TU_LLAVE.pem>
Cognito Region: <TU_VALOR>
Cognito App Client ID: <COGNITO_APP_CLIENT_ID>
Cognito User Pool ID: <COGNITO_USER_POOL_ID>
CloudFront domain: <CLOUDFRONT_DOMAIN>
```
