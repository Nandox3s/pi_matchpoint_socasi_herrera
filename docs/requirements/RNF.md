# Requisitos no funcionales — Fernando Socasi

| ID | Categoría | Criterio verificable |
|---|---|---|
| RNF01 | Seguridad | No versionar credenciales; enviar access token mediante Bearer; limpiar sesión al cerrar sesión. |
| RNF02 | Arquitectura | Compose → ViewModel → Repository → Retrofit; ninguna pantalla llama directamente al API. |
| RNF03 | Usabilidad | Material 3, tema claro/oscuro, jerarquía legible, feedback y confirmaciones. |
| RNF04 | Compatibilidad | Android API 26+, target y compile SDK 36. |
| RNF05 | Calidad | `test assembleDebug lint` debe finalizar con `BUILD SUCCESSFUL`. |
| RNF06 | Resiliencia | Mapear 400, 401, 403, 404, 409, 503 y fallos de red. |
| RNF07 | Rendimiento | Retrofit suspend/corrutinas fuera del hilo principal. |
| RNF08 | Privacidad | No registrar cuerpos/cabeceras de autenticación ni persistir contraseñas. |
