# Guion de sustentación

## Demostración (8–10 minutos)

1. Problema y propuesta de valor.
2. Android MVVM → gateway → Spring → PostgreSQL; Cognito como identidad.
3. PLAYER: login, filtro, reserva, conflicto 409 y cancelación.
4. MANAGER: cancha, torneo, equipos y cuadro.
5. Seguridad: demostrar 401 sin token y 403 con rol/propiedad incorrectos.
6. Calidad: pruebas/lint, RF/RNF, ADR, dominio y despliegue.
7. Negocio: Canvas, ingresos, equilibrio y siguiente experimento.

## Preguntas esperadas

- ¿Por qué MVVM? Separa presentación, coordinación y datos; permite pruebas.
- ¿Por qué no confiar en la pantalla? El cliente puede alterarse; el servidor valida token, rol y propiedad.
- ¿Cómo evitan cruces? La regla transaccional vive en backend/DB; móvil interpreta 409.
- ¿Vertical u horizontal? Servicios stateless horizontalmente; DB vertical al inicio y luego según métricas.
- ¿Dónde están las contraseñas? Cognito las procesa; la app no las persiste ni guarda secretos.
