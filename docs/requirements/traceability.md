# Trazabilidad funcional del frontend

| Requisito | UI | ViewModel | Datos/servicio | Prueba |
|---|---|---|---|---|
| RF01 | `LoginScreen`, `ProfileScreen` | `AuthViewModel` | `AuthRepository`, `SessionManager`, `AuthInterceptor` | validación y errores 401/403 |
| RF02 | `ProfileScreen`, formulario | `ContentViewModel` | `UserRepository`, Users API | correo/teléfono/nombre |
| RF03, RF06 | `CourtsScreen`, detalle/formularios | `ContentViewModel` | `CourtRepository`, Court DTOs | precio/campos |
| RF04, RF05 | `ReservationsScreen`, DatePicker/TimePicker | `ContentViewModel` | `ReservationRepository` | fecha futura/pasada y 409 |
| RF07, RF08 | `TournamentsScreen`, equipos y cuadro | `ContentViewModel` | `TournamentRepository` | capacidad, equipo y marcador |
| RF09 | `StateView`, `SnackbarHost`, diálogos | ViewModels con `UiState` | `ApiErrorMapper` | 200/201/400/401/403/404/409/503 |
| RF10 | Bottom Navigation por rol | `AuthViewModel` | grupos Cognito | inspección y autorización backend |

## Historias y pantallas

- Como PLAYER quiero encontrar y reservar cancha: Inicio → Canchas → Detalle → Reserva → Mis reservas.
- Como PLAYER quiero competir: Torneos → Detalle → Equipos/Cuadro → Inscribir equipo.
- Como MANAGER quiero administrar inventario: Inicio → Mis canchas → Crear/Editar.
- Como MANAGER quiero operar una competencia: Torneos → Detalle → Iniciar → Programar → Resultado.
- Como usuario quiero controlar mis datos y sesión: Perfil → Editar/Cerrar sesión.
