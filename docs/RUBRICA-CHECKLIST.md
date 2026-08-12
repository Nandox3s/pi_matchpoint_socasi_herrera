# Matriz de cumplimiento de la rúbrica P02

Fecha de revisión: 12 de agosto de 2026. Esta matriz enlaza cada criterio con evidencia reproducible. El repositorio Android y el backend MatchPoint son entregables complementarios.

| Criterio | Evidencia | Estado |
|---|---|---|
| 1.1 RF/RNF y casos de uso | [REQUIREMENTS.md](REQUIREMENTS.md) | Cumple |
| 1.2 GitFlow | ramas `feature/*`, `develop`; historial atómico; [CONTRIBUTING.md](CONTRIBUTING.md) | Cumple |
| 1.3 Pruebas unitarias | `app/src/test`: validadores, formatos y errores HTTP; `./gradlew test` | Cumple |
| 1.4 Priorización y ADR | [ADR-001.md](adr/ADR-001.md) y trazabilidad MoSCoW | Cumple |
| 2.1–2.4 Android | flujos por rol, Retrofit, validación, MVVM y Material 3 | Cumple |
| 3.1–3.6 Backend | [ARCHITECTURE.md](ARCHITECTURE.md) y repositorio backend | Cumple sujeto a ejecutar pruebas backend |
| 4.1–4.3 Nube | [CLOUD.md](CLOUD.md) | Cumple documental; despliegue requiere credenciales |
| 5.1–5.3 Emprendimiento | [BUSINESS.md](BUSINESS.md) | Cumple |
| 6.1–6.5 Sustentación | [DEFENSE.md](DEFENSE.md) | Preparado; depende de la exposición |

## Comando de aceptación

```bash
./gradlew test assembleDebug lint
```

Para demostrar la integración se debe iniciar el backend, comprobar el gateway en 9090 y configurar un App Client público de Cognito en `local.properties`. No se incluyen secretos ni se simula una integración exitosa sin esos servicios.
