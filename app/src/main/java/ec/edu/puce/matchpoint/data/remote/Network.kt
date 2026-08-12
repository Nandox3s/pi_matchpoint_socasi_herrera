package ec.edu.puce.matchpoint.data.remote

import com.google.gson.Gson
import ec.edu.puce.matchpoint.BuildConfig
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AuthInterceptor(private val session: SessionManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain) = chain.proceed(chain.request().newBuilder().apply {
        session.accessToken?.let { header("Authorization", "Bearer $it") }
    }.build())
}

class Network(session: SessionManager) {
    private val gson = Gson()
    private val logging = HttpLoggingInterceptor().apply { level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE }
    private val client = OkHttpClient.Builder().addInterceptor(AuthInterceptor(session)).addInterceptor(logging).build()
    private val retrofit = Retrofit.Builder().baseUrl(BuildConfig.API_BASE_URL).client(client).addConverterFactory(GsonConverterFactory.create(gson)).build()
    val users: UsersApiService = retrofit.create(UsersApiService::class.java)
    val matchPoint: MatchPointApiService = retrofit.create(MatchPointApiService::class.java)
    val cognito: CognitoApiService = Retrofit.Builder().baseUrl("https://cognito-idp.${BuildConfig.COGNITO_REGION}.amazonaws.com/").client(OkHttpClient.Builder().addInterceptor(logging).build()).addConverterFactory(GsonConverterFactory.create(gson)).build().create(CognitoApiService::class.java)
}
