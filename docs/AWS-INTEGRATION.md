# Integración Android con AWS

## Datos no secretos requeridos

El responsable de AWS debe compartir región, User Pool ID, App Client ID público y URL del gateway. Android no necesita AWS access keys, client secret ni llave PEM para consumir el sistema.

~~~properties
API_BASE_URL=http://18.234.231.25:9090/
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
~~~

El App Client debe ser público, sin secret, y permitir ALLOW_USER_AUTH y ALLOW_REFRESH_TOKEN_AUTH. Los grupos se llaman exactamente PLAYER y MANAGER.

## Diagnóstico reproducible

~~~bash
curl -i http://18.234.231.25:9090/
curl -i http://18.234.231.25:9090/users/me
curl -i --max-time 30 http://18.234.231.25:9090/matchpoint/courts
~~~

Resultados esperados: gateway 200; /users/me sin token 401; rutas protegidas con JWT válido 200 o 403 según rol. Un timeout en /matchpoint/* se corrige en EC2, no en Android:

~~~bash
docker compose ps
docker compose logs --tail=200 nginx
docker compose logs --tail=200 matchpoint-service
docker compose logs --tail=200 users-service
curl -v http://localhost:9090/matchpoint/courts
~~~

Verificar contenedor healthy, conexión PostgreSQL, nombre/puerto del upstream Nginx y variables Cognito del Resource Server.

## Acceso administrativo

Preferir AWS Systems Manager Session Manager o una cuenta SSH individual. Si se usa SSH, el compañero agrega la clave pública del desarrollador; no se comparte ni versiona la llave privada principal.

~~~bash
ssh -i ruta/matchpoint.pem ubuntu@18.234.231.25
~~~

Para producción se debe publicar el gateway por HTTPS en 443, actualizar API_BASE_URL y retirar el tráfico HTTP en claro.
