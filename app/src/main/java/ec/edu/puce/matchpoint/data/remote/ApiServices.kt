package ec.edu.puce.matchpoint.data.remote

import ec.edu.puce.matchpoint.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface UsersApiService {
    @POST("users/me") suspend fun createProfile(@Body body: UserRequest): UserResponse
    @GET("users/me") suspend fun profile(): UserResponse
    @PUT("users/me") suspend fun updateProfile(@Body body: UserRequest): UserResponse
    @GET("users") suspend fun users(): List<UserResponse>
    @GET("users/{id}") suspend fun user(@Path("id") id: Long): UserResponse
    @DELETE("users/{id}") suspend fun deleteUser(@Path("id") id: Long): Response<Unit>
    @GET("users/cognito/{id}") suspend fun userByCognito(@Path("id") id: String): UserResponse
}

interface MatchPointApiService {
    @GET("matchpoint/me") suspend fun me(): MeResponse
    @GET("matchpoint/courts") suspend fun courts(@Query("sector") sector: String? = null, @Query("sport") sport: SportType? = null): List<CourtResponse>
    @GET("matchpoint/courts/available") suspend fun available(@Query("sector") sector: String?, @Query("sport") sport: SportType?, @Query("startsAt") startsAt: String?, @Query("durationMinutes") duration: Int?): List<CourtResponse>
    @GET("matchpoint/courts/{id}") suspend fun court(@Path("id") id: Long): CourtResponse
    @POST("matchpoint/courts") suspend fun createCourt(@Body body: CreateCourtRequest): CourtResponse
    @PATCH("matchpoint/courts/{id}") suspend fun updateCourt(@Path("id") id: Long, @Body body: UpdateCourtRequest): CourtResponse
    @POST("matchpoint/reservations") suspend fun reserve(@Body body: CreateReservationRequest): ReservationResponse
    @GET("matchpoint/reservations/me") suspend fun reservations(): List<ReservationResponse>
    @GET("matchpoint/reservations/{id}") suspend fun reservation(@Path("id") id: Long): ReservationResponse
    @DELETE("matchpoint/reservations/{id}") suspend fun cancel(@Path("id") id: Long): Response<Unit>
    @GET("matchpoint/tournaments") suspend fun tournaments(): List<TournamentResponse>
    @GET("matchpoint/tournaments/{id}") suspend fun tournament(@Path("id") id: Long): TournamentProgressResponse
    @POST("matchpoint/tournaments") suspend fun createTournament(@Body body: CreateTournamentRequest): TournamentResponse
    @POST("matchpoint/tournaments/{id}/start") suspend fun start(@Path("id") id: Long): TournamentProgressResponse
    @GET("matchpoint/tournaments/{id}/teams") suspend fun teams(@Path("id") id: Long): List<TeamResponse>
    @POST("matchpoint/tournaments/{id}/teams") suspend fun registerTeam(@Path("id") id: Long, @Body body: RegisterTeamRequest): TeamResponse
    @DELETE("matchpoint/tournaments/{id}/teams/{teamId}") suspend fun withdraw(@Path("id") id: Long, @Path("teamId") teamId: Long): Response<Unit>
    @GET("matchpoint/tournaments/{id}/matches") suspend fun matches(@Path("id") id: Long): List<MatchResponse>
    @PATCH("matchpoint/matches/{id}/schedule") suspend fun schedule(@Path("id") id: Long, @Body body: ScheduleMatchRequest): MatchResponse
    @PATCH("matchpoint/matches/{id}/score") suspend fun score(@Path("id") id: Long, @Body body: RegisterScoreRequest): MatchResponse
}

interface CognitoApiService {
    @Headers("Content-Type: application/x-amz-json-1.1", "X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth")
    @POST("/") suspend fun authenticate(@Body body: CognitoAuthRequest): CognitoAuthResponse
    @Headers("Content-Type: application/x-amz-json-1.1", "X-Amz-Target: AWSCognitoIdentityProviderService.RespondToAuthChallenge")
    @POST("/") suspend fun respondToChallenge(@Body body: CognitoChallengeRequest): CognitoAuthResponse
}
