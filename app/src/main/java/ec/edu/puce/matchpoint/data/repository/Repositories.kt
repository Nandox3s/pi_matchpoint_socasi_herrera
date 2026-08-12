package ec.edu.puce.matchpoint.data.repository

import ec.edu.puce.matchpoint.BuildConfig
import ec.edu.puce.matchpoint.data.models.*
import ec.edu.puce.matchpoint.data.remote.*

class AuthRepository(private val api: CognitoApiService, private val session: SessionManager) {
    suspend fun login(username: String, password: String): ApiResult<UserRole> = apiCall {
        check(BuildConfig.COGNITO_APP_CLIENT_ID.isNotBlank()) { "Configura COGNITO_APP_CLIENT_ID en local.properties" }
        val response = api.authenticate(CognitoAuthRequest("USER_PASSWORD_AUTH", BuildConfig.COGNITO_APP_CLIENT_ID, mapOf("USERNAME" to username, "PASSWORD" to password)))
        val result = requireNotNull(response.AuthenticationResult) { "Cognito requiere completar: ${response.ChallengeName}" }
        session.save(requireNotNull(result.AccessToken), result.RefreshToken)
        requireNotNull(session.role) { "La cuenta no pertenece a PLAYER ni MANAGER" }
    }
    suspend fun refresh(): Boolean = runCatching {
        val token = session.refreshToken ?: return false
        val result = api.authenticate(CognitoAuthRequest("REFRESH_TOKEN_AUTH", BuildConfig.COGNITO_APP_CLIENT_ID, mapOf("REFRESH_TOKEN" to token))).AuthenticationResult ?: return false
        session.save(requireNotNull(result.AccessToken), null); true
    }.getOrDefault(false)
    fun logout() = session.clear()
    fun role() = session.role
}
class UserRepository(private val api: UsersApiService) {
    suspend fun profile() = apiCall { api.profile() }; suspend fun create(body: UserRequest) = apiCall { api.createProfile(body) }; suspend fun update(body: UserRequest) = apiCall { api.updateProfile(body) }
}
class CourtRepository(private val api: MatchPointApiService) {
    suspend fun list(sector: String? = null, sport: SportType? = null) = apiCall { api.courts(sector, sport) }
    suspend fun available(sector: String?, sport: SportType?, date: String?, duration: Int?) = apiCall { api.available(sector, sport, date, duration) }
    suspend fun create(body: CreateCourtRequest) = apiCall { api.createCourt(body) }; suspend fun update(id: Long, body: UpdateCourtRequest) = apiCall { api.updateCourt(id, body) }
}
class ReservationRepository(private val api: MatchPointApiService) {
    suspend fun mine() = apiCall { api.reservations() }; suspend fun create(body: CreateReservationRequest) = apiCall { api.reserve(body) }; suspend fun cancel(id: Long) = apiCall { api.cancel(id) }
}
class TournamentRepository(private val api: MatchPointApiService) {
    suspend fun list() = apiCall { api.tournaments() }; suspend fun detail(id: Long) = apiCall { api.tournament(id) }; suspend fun create(body: CreateTournamentRequest) = apiCall { api.createTournament(body) }; suspend fun start(id: Long) = apiCall { api.start(id) }
    suspend fun teams(id: Long) = apiCall { api.teams(id) }; suspend fun register(id: Long, body: RegisterTeamRequest) = apiCall { api.registerTeam(id, body) }; suspend fun withdraw(id: Long, teamId: Long) = apiCall { api.withdraw(id, teamId) }
    suspend fun schedule(id: Long, date: String) = apiCall { api.schedule(id, ScheduleMatchRequest(date)) }; suspend fun score(id: Long, home: Int, away: Int) = apiCall { api.score(id, RegisterScoreRequest(home, away)) }
}
