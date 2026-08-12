package ec.edu.puce.matchpoint.data.remote

import com.google.gson.JsonParser
import retrofit2.HttpException
import java.io.IOException

sealed interface ApiResult<out T> { data class Success<T>(val data: T): ApiResult<T>; data class Error(val message: String, val code: Int? = null): ApiResult<Nothing> }

object ApiErrorMapper {
    fun map(error: Throwable): ApiResult.Error {
        if (error is IOException) return ApiResult.Error("No se pudo conectar con el servidor. Revisa tu conexión.")
        if (error !is HttpException) return ApiResult.Error("Ocurrió un error inesperado. Intenta nuevamente.")
        val backend = runCatching {
            val json = JsonParser.parseString(error.response()?.errorBody()?.string()).asJsonObject
            json.get("error")?.asString ?: json.get("message")?.asString
        }.getOrNull()
        val message = when (error.code()) {
            400 -> "Revisa los datos ingresados."
            401 -> "Tu sesión expiró. Inicia sesión nuevamente."
            403 -> "No tienes permisos para realizar esta acción."
            404 -> "El recurso solicitado no existe."
            409 -> functionalConflict(backend)
            500 -> "El servidor encontró un problema. Intenta más tarde."
            503, 504 -> "El servicio no está disponible temporalmente."
            else -> backend ?: "No se pudo completar la operación."
        }
        return ApiResult.Error(message, error.code())
    }
    private fun functionalConflict(raw: String?): String = when {
        raw?.contains("booked", true) == true -> "Esta cancha ya está reservada en ese horario."
        raw?.contains("profile", true) == true -> "Primero debes completar tu perfil."
        raw?.contains("full", true) == true -> "El torneo ya no tiene cupos disponibles."
        raw?.contains("closed", true) == true -> "La inscripción del torneo está cerrada."
        else -> raw ?: "La operación entra en conflicto con el estado actual."
    }
}

suspend fun <T> apiCall(block: suspend () -> T): ApiResult<T> = try { ApiResult.Success(block()) } catch (t: Throwable) { ApiErrorMapper.map(t) }
