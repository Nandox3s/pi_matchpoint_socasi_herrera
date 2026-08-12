# Requisitos funcionales — Fernando Socasi

| ID | Actor | Requisito | Pantalla/flujo Android |
|---|---|---|---|
| RF01 | Todos | Autenticarse con Cognito y cerrar sesión. | Login, Perfil |
| RF02 | Todos | Consultar, crear y editar el perfil propio. | Perfil |
| RF03 | PLAYER | Listar, buscar, filtrar y consultar canchas. | Canchas, detalle |
| RF04 | PLAYER | Crear una reserva futura y recibir conflicto 409 si el horario está ocupado. | Formulario de reserva |
| RF05 | PLAYER | Consultar detalle y cancelar reservas propias. | Mis reservas |
| RF06 | MANAGER | Crear y editar sus canchas con datos válidos. | Mis canchas |
| RF07 | PLAYER | Consultar torneos, equipos, cuadro e inscribir un equipo. | Torneos |
| RF08 | MANAGER | Crear/iniciar torneos y gestionar visualmente partidos. | Torneos, cuadro |
| RF09 | Todos | Mostrar estados de carga, vacío y errores HTTP comprensibles. | Componentes comunes |
| RF10 | Todos | Adaptar navegación y acciones a PLAYER/MANAGER sin reemplazar permisos backend. | Navegación principal |
