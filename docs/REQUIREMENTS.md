# Requisitos y casos de uso

## Objetivo

MatchPoint permite localizar y reservar canchas de básquet y administrar torneos, evitando cruces de horarios y restringiendo cada operación según el rol autenticado.

## Requisitos funcionales

| ID | Prioridad | Descripción / criterio de aceptación | Actor |
|---|---|---|---|
| RF01 | Must | Iniciar sesión con Cognito; credenciales inválidas no crean sesión. | Todos |
| RF02 | Must | Crear y actualizar el perfil propio con datos válidos. | Todos |
| RF03 | Must | Consultar y filtrar canchas activas por nombre y sector. | PLAYER |
| RF04 | Must | Reservar una cancha en fecha futura; un cruce devuelve conflicto y no duplica la reserva. | PLAYER |
| RF05 | Must | Consultar y cancelar únicamente reservas propias. | PLAYER |
| RF06 | Must | Crear y actualizar canchas propias con precio positivo. | MANAGER |
| RF07 | Should | Inscribir equipos mientras existan cupos y el registro esté abierto. | PLAYER |
| RF08 | Should | Crear torneos con cupos potencia de dos e iniciarlos según las reglas. | MANAGER |
| RF09 | Should | Programar partidos y registrar marcadores válidos. | MANAGER |
| RF10 | Must | Ocultar acciones ajenas al rol y rechazarlas con 401/403 en backend. | Todos |

## Requisitos no funcionales

| ID | Descripción verificable |
|---|---|
| RNF01 Seguridad | JWT validado en backend; secretos, tokens y contraseñas no se versionan ni aparecen en logs. |
| RNF02 Usabilidad | Material 3, modo claro/oscuro y estados de carga/error/vacío. |
| RNF03 Compatibilidad | Android 8 (API 26) o superior; target/compile SDK 36. |
| RNF04 Mantenibilidad | UI → ViewModel → Repository → API, sin Retrofit en Composables. |
| RNF05 Calidad | `test`, `assembleDebug` y `lint` correctos antes de integrar. |
| RNF06 Resiliencia | Errores 401, 403, 404, 409, 500 y 503/504 traducidos a mensajes útiles. |
| RNF07 Rendimiento | Operaciones de red suspendidas, sin bloquear el hilo principal. |

## Casos de uso esenciales

### CU01 — Iniciar sesión

- Precondición: usuario de Cognito perteneciente a PLAYER o MANAGER.
- Flujo: credenciales → Cognito → tokens → rol → inicio correspondiente.
- Alternos: campos inválidos; 401 no crea sesión; rol desconocido se rechaza.
- Postcondición: solicitudes con `Bearer access_token`.

### CU02 — Reservar cancha

- Precondición: PLAYER, perfil creado y cancha activa.
- Flujo: consultar → seleccionar fecha/duración → confirmar → persistir → listar.
- Alternos: horario ocupado (409), datos inválidos (400), permiso insuficiente (403).

### CU03 — Administrar torneo

- Precondición: MANAGER.
- Flujo: crear torneo → recibir equipos → iniciar cuadro → programar → registrar resultados.
- Alternos: cupos inválidos, torneo incompleto/cerrado, empate o recurso de otro manager.

## Trazabilidad

| Requisito | Implementación | Evidencia |
|---|---|---|
| RF01, RF10 | `AuthRepository`, `SessionManager`, `AuthViewModel`, navegación por rol | validación login y mapeo 401/403 |
| RF02 | `UsersRepository`, formulario de perfil | `Validators.profile` |
| RF03–RF06 | repositorios y pantallas de canchas/reservas | validaciones y error 409 |
| RF07–RF09 | repositorio y pantallas de torneos | validaciones de torneo/equipo/marcador |
| RNF04–RNF07 | paquetes `ui`, `viewmodel`, `data`, corrutinas y `ApiErrorMapper` | Gradle test + lint |
