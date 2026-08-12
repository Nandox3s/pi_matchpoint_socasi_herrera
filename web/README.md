# MatchPoint Web — cliente complementario

> **La aplicación principal del proyecto es la app Android de la raíz del repositorio.** Este
> cliente web deriva de ella y no la sustituye: el criterio 2 de la rúbrica P02 evalúa una
> aplicación móvil en Android Studio, y esa evidencia es el proyecto Gradle de la raíz. El aporte
> de este módulo es al criterio 4 (computación en la nube). Ver
> [docs/RUBRICA-CHECKLIST.md](../docs/RUBRICA-CHECKLIST.md).

Cliente web de MatchPoint desplegado en Vercel. Consume **el mismo backend** que la app Android
(microservicios `users` y `matchpoint` detrás del gateway Nginx) y usa **el mismo App Client de
AWS Cognito**. No duplica lógica de negocio: el backend sigue siendo la única autoridad de
permisos, propiedad y validación.

## El contrato lo define la app Android

Estos archivos son espejo del proyecto Android y deben actualizarse **después** de él, nunca antes:

| Archivo web | Origen en la app Android |
|---|---|
| `src/lib/types.ts` | `app/src/main/java/ec/edu/puce/matchpoint/data/models/Models.kt` |
| `src/lib/validators.ts` | `app/src/main/java/ec/edu/puce/matchpoint/utils/Validators.kt` |
| `src/lib/api.ts` (traducción de errores) | `data/remote/ApiResult.kt` (`ApiErrorMapper`) |
| `src/lib/format.ts` | `utils/Formatters.kt` |
| `src/app/api/backend/[...path]/route.ts` | `data/remote/Network.kt` (`AuthInterceptor`, `TokenAuthenticator`) |
| Navegación inferior y pantallas por rol | `MainActivity.kt`, `ui/screens/Screens.kt` |

## Por qué existe el proxy `/api/backend`

Vercel sirve el sitio por **HTTPS** y el gateway del backend habla **HTTP puro** en el puerto 9090.
Si el navegador llamara directo al backend, el navegador bloquearía la petición por *mixed content*.

Por eso todas las llamadas pasan por una función serverless:

```
navegador  ──HTTPS──>  /api/backend/*  (Vercel, servidor)  ──HTTP──>  http://<gateway>:9090/*
```

Beneficio adicional: el **access token nunca llega al navegador**. Vive en una cookie `httpOnly`
que solo la función serverless puede leer, y es esa función la que añade el `Authorization: Bearer`.
Es más estricto que el cliente Android, que guarda el token en `SharedPreferences`.

## Diseño mobile-first

El uso principal es el teléfono, así que la base del CSS es móvil y escritorio es la adaptación
(`@media (min-width: 900px)`):

- **Navegación inferior fija** en móvil, igual que la `NavigationBar` de Android; en escritorio sube al encabezado.
- **Diálogos como hoja inferior** (*bottom sheet*) con tirador y animación; en escritorio son tarjeta centrada.
- Objetivos táctiles de 48px e inputs a **16px exactos** — por debajo de eso iOS hace zoom al enfocar.
- Zonas seguras respetadas con `viewportFit: "cover"` + `env(safe-area-inset-*)`, para que el FAB,
  el toast y la barra inferior no queden bajo el notch ni bajo la barra de gestos.
- `manifest.webmanifest` e iconos: se puede **agregar a la pantalla de inicio** y abrir sin barra del navegador.

## Arquitectura

```
app/(app)/*        Pantallas autenticadas (dashboard, canchas, reservas, torneos, perfil)
app/login          Inicio de sesión contra Cognito
app/api/auth/*     login (USER_AUTH + reto PASSWORD), logout y lectura de sesión
app/api/backend/*  Proxy firmado hacia el gateway, con refresh automático ante 401
app/api/health     Diagnóstico de despliegue (backend alcanzable + variables presentes)
lib/types.ts       Espejo exacto de data/models/Models.kt
lib/validators.ts  Espejo exacto de utils/Validators.kt
lib/api.ts         Cliente de navegador y traducción de errores (espejo de ApiErrorMapper)
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `API_BASE_URL` | sí | Gateway Nginx, sin barra final. Ej. `http://18.234.231.25:9090` |
| `COGNITO_REGION` | sí | Región del User Pool. Ej. `us-east-1` |
| `COGNITO_APP_CLIENT_ID` | sí | App Client **público** (sin secret) con `ALLOW_USER_AUTH` habilitado |
| `COGNITO_USER_POOL_ID` | no | Solo informativo para `/api/health` |

Ninguna lleva el prefijo `NEXT_PUBLIC_`: todas se leen únicamente en el servidor.

## Desarrollo local

```bash
cd web
cp .env.example .env.local   # completa COGNITO_APP_CLIENT_ID
npm install
npm run dev                  # http://localhost:3000
```

Verifica la configuración en <http://localhost:3000/api/health> antes de intentar iniciar sesión.

## Despliegue en Vercel

1. **Root Directory**: en Vercel → *Settings → Build and Deployment → Root Directory*, escribe `web`.
   Sin este paso Vercel busca un proyecto web en la raíz, no lo encuentra y sirve un `404 NOT_FOUND`.
2. **Framework Preset**: `Next.js` (Vercel lo detecta solo una vez fijado el Root Directory).
3. **Environment Variables**: agrega las cuatro variables de la tabla anterior en *Production*,
   *Preview* y *Development*.
4. **Production Branch**: `main`. Vercel publica en el dominio principal lo que haya en esa rama.
5. Redespliega y abre `/api/health`. Debe responder `"ok": true`.

## Errores comunes

| Síntoma | Causa |
|---|---|
| `404 NOT_FOUND` de Vercel | Falta configurar Root Directory = `web` |
| Aviso "Falta configurar COGNITO_APP_CLIENT_ID" | La variable no está en Vercel o el deploy es anterior a agregarla |
| `Tu sesión expiró` en todas las pantallas | Token inválido, App Client incorrecto o usuario sin grupo PLAYER/MANAGER |
| `No se pudo conectar con el backend` | Gateway apagado o Security Group de AWS bloqueando el puerto 9090 |
| `409` al reservar | Franja ocupada, cancha inactiva o **perfil aún no creado** (créalo en *Perfil*) |
| `403` al crear cancha o torneo | La cuenta no pertenece al grupo `MANAGER` |
