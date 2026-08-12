# MatchPoint Mobile

> La [matriz de cumplimiento de la rúbrica P02](docs/RUBRICA-CHECKLIST.md) reúne requisitos, ADR, arquitectura, nube, negocio y preparación de la sustentación con evidencia verificable.

**Aplicación Android** de reservas deportivas y torneos, desarrollada en Android Studio y conectada al backend real MatchPoint mediante Nginx, Retrofit y AWS Cognito. Es el producto principal del proyecto: define el contrato con el backend, los flujos por rol y las reglas de validación de las que derivan los demás clientes.

## Tecnologías y arquitectura

Kotlin, Jetpack Compose, Material 3, Navigation Compose, Retrofit/Gson/OkHttp, Coroutines, ViewModel y StateFlow. Flujo: `Compose → ViewModel → Repository → Retrofit → Nginx → Spring Boot → PostgreSQL`. La sesión sigue `Android → Cognito → access token → AuthInterceptor → backend`.

El código está organizado en `data/models`, `data/remote`, `data/repository`, `viewmodel`, `ui` y `utils`. Los Composables no invocan Retrofit.

## Configuración

1. Copia `local.properties.example` como `local.properties`.
2. Configura `sdk.dir`, `COGNITO_APP_CLIENT_ID` y, si aplica, región/User Pool. Debe ser un App Client nativo/público sin secret y con `ALLOW_USER_AUTH` habilitado. La app realiza `USER_AUTH`, solicita el desafío `PASSWORD` y lo responde sin guardar la contraseña.
3. Para emulador usa `API_BASE_URL=http://10.0.2.2:9090/`; para dispositivo físico cambia `10.0.2.2` por la IP LAN del equipo.
4. En el repositorio backend independiente crea `.env`, levanta `docker compose up -d --build` y confirma que Nginx escucha en 9090.
5. Abre este proyecto en Android Studio o ejecuta `./gradlew assembleDebug`.

`sdk.dir` es propio de cada máquina: en Windows apunta a `C:\Users\<usuario>\AppData\Local\Android\Sdk` y en macOS a `~/Library/Android/sdk`. Por eso `local.properties` no se versiona.

No se versionan tokens, contraseñas, `.env`, `local.properties` ni keystores. Los logs HTTP son BASIC y nunca muestran cabeceras ni cuerpos.

## Roles y funcionalidades

- PLAYER: consulta/filtra canchas, crea y cancela reservas, consulta torneos e inscribe equipos, gestiona su perfil.
- MANAGER: crea y consulta sus canchas, crea/inicia torneos y accede a gestión deportiva. El backend continúa siendo la autoridad de permisos y propiedad.

El backend real solo expone `BASKET` como deporte. Las fechas se envían como `LocalDateTime` ISO-8601 sin zona.

## Pruebas

```bash
./gradlew test assembleDebug lint
```

`test` cubre validaciones de perfil, cancha, reserva, torneo y marcador, además del mapeo HTTP 401/403/409/503: 17 pruebas en `ValidatorsTest`, `FormattersTest`, `ApiCallTest` y `ApiErrorMapperTest`.

## GitFlow

El desarrollo se realiza en ramas `feature/*` y se integra después en `develop`; `main` queda para entregas estables.

## Errores comunes

- `Connection refused`: backend apagado, puerto 9090 bloqueado o URL incorrecta.
- `401`: token vencido o configuración Cognito incorrecta.
- `403`: rol o propiedad no permitidos por backend.
- `409` al reservar: franja ocupada, cancha inactiva o perfil aún no creado.
- `503/504`: microservicio temporalmente no disponible.

Las capturas de pantalla quedan pendientes hasta ejecutar la app con usuarios Cognito reales.

## Anexo: cliente web complementario

En [`web/`](web/README.md) hay un cliente web desplegado en Vercel que **deriva de esta aplicación**, no la sustituye. La app Android es la fuente del contrato: `web/src/lib/types.ts` es espejo de `data/models/Models.kt`, `web/src/lib/validators.ts` lo es de `utils/Validators.kt`, y los mensajes de error replican `ApiErrorMapper`. Ambos clientes consumen el mismo gateway y el mismo App Client de Cognito.

Se incorporó como evidencia adicional del criterio 4 (computación en la nube), donde demuestra un despliegue serverless real. **El criterio 2 de la rúbrica evalúa la aplicación móvil en Android Studio**, y esa evidencia sigue siendo íntegramente el proyecto Gradle de la raíz.
