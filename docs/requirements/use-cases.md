# Casos de uso móviles

## CU01 — Autenticarse

Actor: PLAYER o MANAGER. Ingresa credenciales, Cognito inicia `USER_AUTH` y responde el desafío `PASSWORD`; la aplicación conserva tokens, detecta el grupo y abre la navegación correspondiente. Credenciales inválidas o rol desconocido no crean una sesión utilizable.

## CU02 — Reservar cancha

Actor: PLAYER. Busca una cancha, revisa el detalle, selecciona fecha, hora y duración futuras y confirma. El backend decide la disponibilidad real; un solapamiento se muestra como conflicto 409. Puede consultar y cancelar su reserva.

## CU03 — Gestionar cancha

Actor: MANAGER. Consulta únicamente la vista de sus canchas, crea una con campos completos y precio positivo, o actualiza precio/estado. La propiedad definitiva se valida en backend.

## CU04 — Participar en torneo

Actor: PLAYER. Consulta torneo, equipos, estadísticas y cuadro; durante REGISTRATION puede inscribir un equipo con contacto válido.

## CU05 — Gestionar torneo

Actor: MANAGER. Crea un torneo con capacidad potencia de dos, lo inicia cuando está completo, programa partidos y registra un marcador no negativo y sin empate. El backend genera y avanza el cuadro.

## CU06 — Gestionar perfil

Actor: todos. Consulta y edita nombre, correo y teléfono, visualiza su rol y puede cerrar sesión desde Perfil.
