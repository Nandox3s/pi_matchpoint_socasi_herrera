# Infraestructura y computación en la nube

```mermaid
flowchart TB
  A[Android] --> TLS[HTTPS + Load Balancer]
  TLS --> GW[Nginx Gateway]
  GW --> US[Users container]
  GW --> MS[MatchPoint container]
  US --> PG[(PostgreSQL administrado)]
  MS --> PG
  A --> CO[AWS Cognito]
  OBS[Logs, métricas y alarmas] --- GW
  OBS --- US
  OBS --- MS
```

Contenedores inmutables, variables/gestor de secretos, health checks, red privada para servicios/DB, TLS público y backups automáticos.

| Escalamiento | Ventajas | Desventajas | Uso |
|---|---|---|---|
| Vertical | simple, sin coordinación | límite físico y mayor impacto por fallo | PostgreSQL según métricas |
| Horizontal | elasticidad y disponibilidad | exige balanceo/observabilidad/stateless | réplicas de gateway y Spring |

## Aceptación operativa

- `docker compose up -d --build` crea el entorno de desarrollo.
- Health checks retiran instancias no disponibles.
- CPU, memoria, latencia, 5xx y conexiones DB generan alarmas.
- Secretos fuera de imágenes y Git.
- La restauración de backups se ensaya antes de entregar.
