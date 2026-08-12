package ec.edu.puce.matchpoint.data.remote

import com.google.gson.Gson
import ec.edu.puce.matchpoint.BuildConfig
import okhttp3.Interceptor
import okhttp3.Authenticator
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import kotlinx.coroutines.runBlocking
import ec.edu.puce.matchpoint.data.models.CognitoAuthRequest
import java.util.concurrent.TimeUnit

class AuthInterceptor(private val session: SessionManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain) = chain.proceed(chain.request().newBuilder().apply {
        session.accessToken?.let { header("Authorization", "Bearer $it") }
    }.build())
}

class TokenAuthenticator(
    private val session: SessionManager,
    private val cognito: CognitoApiService
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? = synchronized(this) {
        if (responseCount(response) >= 2) return null
        val failedToken = response.request.header("Authorization")?.removePrefix("Bearer ")
        val currentToken = session.accessToken
        if (!currentToken.isNullOrBlank() && currentToken != failedToken) {
            return response.request.newBuilder().header("Authorization", "Bearer $currentToken").build()
        }
        val refreshToken = session.refreshToken ?: return null
        val refreshed = runCatching {
            runBlocking {
                cognito.authenticate(
                    CognitoAuthRequest(
                        "REFRESH_TOKEN_AUTH",
                        BuildConfig.COGNITO_APP_CLIENT_ID,
                        mapOf("REFRESH_TOKEN" to refreshToken)
                    )
                ).AuthenticationResult
            }
        }.getOrNull()
        val accessToken = refreshed?.AccessToken
        if (accessToken.isNullOrBlank()) {
            session.clear()
            return null
        }
        session.save(accessToken, null)
        response.request.newBuilder().header("Authorization", "Bearer $accessToken").build()
    }

    private fun responseCount(response: Response): Int {
        var count = 1
        var prior = response.priorResponse
        while (prior != null) { count++; prior = prior.priorResponse }
        return count
    }
}

class Network(session: SessionManager) {
    private val gson = Gson()
    private val logging = HttpLoggingInterceptor().apply { level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE }
    private fun OkHttpClient.Builder.withTimeouts() = connectTimeout(10,TimeUnit.SECONDS).readTimeout(20,TimeUnit.SECONDS).writeTimeout(20,TimeUnit.SECONDS).callTimeout(30,TimeUnit.SECONDS)
    val cognito: CognitoApiService = Retrofit.Builder().baseUrl("https://cognito-idp.${BuildConfig.COGNITO_REGION.ifBlank{"us-east-1"}}.amazonaws.com/").client(OkHttpClient.Builder().withTimeouts().addInterceptor(logging).build()).addConverterFactory(GsonConverterFactory.create(gson)).build().create(CognitoApiService::class.java)
    private val client = OkHttpClient.Builder().withTimeouts().addInterceptor(AuthInterceptor(session)).authenticator(TokenAuthenticator(session,cognito)).addInterceptor(logging).build()
    private val retrofit = Retrofit.Builder().baseUrl(BuildConfig.API_BASE_URL).client(client).addConverterFactory(GsonConverterFactory.create(gson)).build()
    val users: UsersApiService = retrofit.create(UsersApiService::class.java)
    val matchPoint: MatchPointApiService = retrofit.create(MatchPointApiService::class.java)
}
