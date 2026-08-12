# Flujo GitFlow

1. Crear `feature/<alcance>` desde `develop`.
2. Commits pequeños: `tipo(área): resultado`.
3. Ejecutar `./gradlew test assembleDebug lint`.
4. Pull request hacia `develop` con criterios y evidencia.
5. Integrar a `main` solo versiones estables etiquetadas.

Los `hotfix/*` salen de `main` y regresan a `main` y `develop`. Nunca se versionan `.env`, `local.properties`, tokens, contraseñas, client secrets o keystores.
