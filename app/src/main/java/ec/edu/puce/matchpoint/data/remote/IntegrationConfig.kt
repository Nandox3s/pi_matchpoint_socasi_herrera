package ec.edu.puce.matchpoint.data.remote

import ec.edu.puce.matchpoint.BuildConfig

object IntegrationConfig {
    fun authError(region: String = BuildConfig.COGNITO_REGION, clientId: String = BuildConfig.COGNITO_APP_CLIENT_ID): String? = when {
        region.isBlank() -> "Configura COGNITO_REGION en local.properties."
        clientId.isBlank() -> "Configura COGNITO_APP_CLIENT_ID en local.properties."
        else -> null
    }

    fun apiError(baseUrl: String = BuildConfig.API_BASE_URL): String? = when {
        !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://") -> "API_BASE_URL debe comenzar con http:// o https://."
        !baseUrl.endsWith("/") -> "API_BASE_URL debe terminar en /."
        else -> null
    }
}
