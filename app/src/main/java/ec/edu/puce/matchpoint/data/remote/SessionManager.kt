package ec.edu.puce.matchpoint.data.remote

import android.content.Context
import android.util.Base64
import com.google.gson.Gson
import ec.edu.puce.matchpoint.data.models.UserRole

class SessionManager(context: Context) {
    private val prefs = context.getSharedPreferences("matchpoint_session", Context.MODE_PRIVATE)
    var accessToken: String?
        get() = prefs.getString("access", null)
        private set(value) { prefs.edit().putString("access", value).apply() }
    var refreshToken: String?
        get() = prefs.getString("refresh", null)
        private set(value) { prefs.edit().putString("refresh", value).apply() }
    val username: String? get() = claim("username") as? String
    val role: UserRole? get() = (claim("cognito:groups") as? List<*>)?.mapNotNull { it as? String }?.let { groups ->
        when { "MANAGER" in groups -> UserRole.MANAGER; "PLAYER" in groups -> UserRole.PLAYER; else -> null }
    }
    fun save(access: String, refresh: String?) { accessToken = access; if (refresh != null) refreshToken = refresh }
    fun clear() = prefs.edit().clear().apply()
    private fun claim(name: String): Any? = runCatching {
        val payload = accessToken!!.split('.')[1]
        val json = String(Base64.decode(payload, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING))
        Gson().fromJson(json, Map::class.java)[name]
    }.getOrNull()
}
