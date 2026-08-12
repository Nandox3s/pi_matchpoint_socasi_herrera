# Matriz de cumplimiento de la rúbrica P02

Fecha de revisión: 12 de agosto de 2026. Esta matriz enlaza cada criterio con evidencia reproducible. El entregable evaluado en el criterio 2 es la **aplicación Android de este repositorio**; el backend MatchPoint y el cliente web son entregables complementarios.

| Criterio | Evidencia | Estado |
|---|---|---|
| 1.1 RF/RNF y casos de uso | [REQUIREMENTS.md](REQUIREMENTS.md) | Cumple |
| 1.2 GitFlow | ramas `feature/*`, `develop`; historial atómico; [CONTRIBUTING.md](CONTRIBUTING.md) | Cumple |
| 1.3 Pruebas unitarias | `app/src/test`: validadores, formatos y errores HTTP; `./gradlew test` | Cumple |
| 1.4 Priorización y ADR | [ADR-001.md](adr/ADR-001.md) y trazabilidad MoSCoW | Cumple |
| 2.1–2.4 Android | ver desglose abajo | Cumple |
| 3.1–3.6 Backend | [ARCHITECTURE.md](ARCHITECTURE.md) y repositorio backend | Cumple sujeto a ejecutar pruebas backend |
| 4.1–4.3 Nube | [CLOUD.md](CLOUD.md) | Cumple documental; despliegue requiere credenciales |
| 5.1–5.3 Emprendimiento | [BUSINESS.md](BUSINESS.md) | Cumple |
| 6.1–6.5 Sustentación | [DEFENSE.md](DEFENSE.md) | Preparado; depende de la exposición |

## Criterio 2 — Desarrollo Móvil (/8)

> *"Evaluación de desarrollo de una aplicación móvil en Android Studio"*

La evidencia es exclusivamente el proyecto Gradle de la raíz. El cliente web de `web/` **no sustituye** este criterio.

| Sub-criterio | Puntos | Evidencia en el proyecto Android |
|---|---|---|
| 2.1 Cumple el objetivo principal y ejecuta las funciones establecidas | /2 | `ui/screens/Screens.kt`: reserva y cancelación de canchas, creación e inicio de torneos, inscripción de equipos, cuadro de eliminación directa, marcadores y perfil. Navegación por rol PLAYER/MANAGER en `MainActivity.kt`. |
| 2.2 Conexión a una API/WebService que almacene información en una base de datos | /3 | `data/remote/ApiServices.kt` (Retrofit) → Nginx → Spring Boot → PostgreSQL. `Network.kt` con `AuthInterceptor` y `TokenAuthenticator`; `data/repository/Repositories.kt` sobre los microservicios `users` y `matchpoint`. |
| 2.3 Validaciones en formularios y patrones de diseño | /2 | `utils/Validators.kt` (perfil, cancha, reserva, torneo, equipo, marcador) con 9 pruebas en `ValidatorsTest`. Patrón MVVM por capas: `Compose → ViewModel → Repository → Retrofit`; los Composables no invocan Retrofit. |
| 2.4 Diseño amigable para el usuario | /1 | Material 3 con tema propio en `ui/theme/Theme.kt`, componentes reutilizables en `ui/components/Common.kt`, estados de carga/vacío/error en `StateView`, y mensajes de error traducidos a lenguaje de usuario en `ApiErrorMapper`. |

## Comando de aceptación

```bash
./gradlew test assembleDebug lint
```

Verificado el 12 de agosto de 2026: 17 pruebas unitarias sin fallos (`ValidatorsTest` 9, `ApiErrorMapperTest` 4, `ApiCallTest` 3, `FormattersTest` 1).

Para demostrar la integración se debe iniciar el backend, comprobar el gateway en 9090 y configurar un App Client público de Cognito en `local.properties`. No se incluyen secretos ni se simula una integración exitosa sin esos servicios.

## Evidencia complementaria del criterio 4

El cliente web de [`web/`](../web/README.md), desplegado en Vercel, aporta evidencia adicional al criterio 4.2 (nubes públicas) y 4.3 (arquitectura de despliegue): funciones serverless que resuelven el paso HTTPS → HTTP hacia el gateway y guardan el token fuera del navegador. Deriva del contrato definido por la app Android y se documenta en [CLOUD.md](CLOUD.md).
