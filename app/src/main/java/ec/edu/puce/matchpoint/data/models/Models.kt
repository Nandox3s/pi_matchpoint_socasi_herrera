package ec.edu.puce.matchpoint.data.models

enum class UserRole { PLAYER, MANAGER }
enum class SportType { BASKET }
enum class ReservationStatus { CONFIRMED, CANCELLED }
enum class TournamentStatus { REGISTRATION, IN_PROGRESS, FINISHED }
enum class MatchStatus { PENDING, READY, PLAYED }

data class UserRequest(val name: String, val email: String?, val phone: String?)
data class UserResponse(val id: Long, val cognitoId: String, val username: String, val name: String, val email: String?, val phone: String?, val createdAt: String)
data class CreateCourtRequest(val name: String, val sector: String, val hasParking: Boolean, val sportType: SportType, val floorType: String, val pricePerHour: Double)
data class UpdateCourtRequest(val pricePerHour: Double? = null, val active: Boolean? = null)
data class CourtResponse(val id: Long, val name: String, val sector: String, val hasParking: Boolean, val sportType: SportType, val floorType: String, val pricePerHour: Double, val active: Boolean, val managerUser: String, val createdAt: String)
data class CreateReservationRequest(val courtId: Long, val startsAt: String, val durationMinutes: Int)
data class ReservationResponse(val id: Long, val courtId: Long, val courtName: String, val ownerUser: String, val ownerName: String, val startsAt: String, val durationMinutes: Int, val status: ReservationStatus, val createdAt: String)
data class CreateTournamentRequest(val name: String, val sportType: SportType, val maxTeams: Int, val prize: String? = null, val courtId: Long? = null)
data class TournamentResponse(val id: Long, val name: String, val sportType: SportType, val maxTeams: Int, val registeredTeams: Int, val prize: String?, val status: TournamentStatus, val managerUser: String, val courtName: String?, val championTeamName: String?, val createdAt: String)
data class RegisterTeamRequest(val name: String, val contactName: String, val contactEmail: String, val contactPhone: String)
data class TeamStatsResponse(val eliminated: Boolean, val matchesPlayed: Int, val matchesWon: Int, val matchesLost: Int, val pointsFor: Int, val pointsAgainst: Int, val currentRound: Int)
data class TeamResponse(val id: Long, val tournamentId: Long, val name: String, val contactName: String, val contactEmail: String, val contactPhone: String, val registeredByUser: String, val stats: TeamStatsResponse, val createdAt: String)
data class ScheduleMatchRequest(val scheduledAt: String)
data class RegisterScoreRequest(val homeScore: Int, val awayScore: Int)
data class MatchResponse(val id: Long, val tournamentId: Long, val roundNumber: Int, val positionInRound: Int, val homeTeamName: String?, val awayTeamName: String?, val homeScore: Int?, val awayScore: Int?, val winnerTeamName: String?, val status: MatchStatus, val scheduledAt: String?)
data class RoundResponse(val roundNumber: Int, val roundName: String, val matches: List<MatchResponse>)
data class TournamentProgressResponse(val tournament: TournamentResponse, val rounds: List<RoundResponse>, val champion: TeamResponse?)
data class MeResponse(val username: String, val sub: String, val email: String?, val groups: List<String>, val profile: UserResponse?)

data class CognitoAuthRequest(val AuthFlow: String, val ClientId: String, val AuthParameters: Map<String, String>)
data class CognitoAuthResult(val AccessToken: String?, val IdToken: String?, val RefreshToken: String?, val ExpiresIn: Int?, val TokenType: String?)
data class CognitoAuthResponse(val AuthenticationResult: CognitoAuthResult?, val ChallengeName: String? = null)
