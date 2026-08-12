package ec.edu.puce.matchpoint.utils

import java.time.LocalDateTime

object Validators {
    private val email = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    private val phone = Regex("^\\+?[0-9]{7,15}$")
    fun profile(name: String, mail: String, mobile: String): String? = when { name.trim().length < 2 -> "Ingresa un nombre válido."; mail.isNotBlank() && !email.matches(mail) -> "Ingresa un correo válido."; mobile.isNotBlank() && !phone.matches(mobile) -> "Ingresa un teléfono de 7 a 15 dígitos."; else -> null }
    fun court(name: String, sector: String, floor: String, price: Double?): String? = when { name.isBlank() || sector.isBlank() || floor.isBlank() -> "Completa nombre, sector y tipo de piso."; price == null || price <= 0 -> "El precio debe ser mayor que cero."; else -> null }
    fun reservation(courtId: Long?, startsAt: String, duration: Int?): String? = when { courtId == null || courtId <= 0 -> "Selecciona una cancha."; runCatching { LocalDateTime.parse(startsAt) }.getOrNull()?.isAfter(LocalDateTime.now()) != true -> "Selecciona una fecha y hora futura."; duration == null || duration <= 0 -> "La duración debe ser mayor que cero."; else -> null }
    fun tournament(name: String, maxTeams: Int?): String? = when { name.isBlank() -> "Ingresa el nombre del torneo."; maxTeams == null || maxTeams < 2 || maxTeams and (maxTeams - 1) != 0 -> "Los cupos deben ser una potencia de 2 (2, 4, 8...)."; else -> null }
    fun team(name: String, contact: String, mail: String, mobile: String): String? = when { name.isBlank() || contact.isBlank() -> "Completa el equipo y el contacto."; !email.matches(mail) -> "Ingresa un correo válido."; !phone.matches(mobile) -> "Ingresa un teléfono válido."; else -> null }
    fun score(home: Int?, away: Int?): String? = when { home == null || away == null || home < 0 || away < 0 -> "Los marcadores deben ser números no negativos."; home == away -> "El backend no permite empates."; else -> null }
}
