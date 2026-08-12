package ec.edu.puce.matchpoint

import android.app.Application
import ec.edu.puce.matchpoint.data.remote.Network
import ec.edu.puce.matchpoint.data.remote.SessionManager
import ec.edu.puce.matchpoint.data.repository.*

class MatchPointApplication : Application() {
    lateinit var container: AppContainer
    override fun onCreate() { super.onCreate(); container = AppContainer(this) }
}
class AppContainer(app: Application) {
    val session = SessionManager(app)
    private val network = Network(session)
    val auth = AuthRepository(network.cognito, session)
    val users = UserRepository(network.users)
    val courts = CourtRepository(network.matchPoint)
    val reservations = ReservationRepository(network.matchPoint)
    val tournaments = TournamentRepository(network.matchPoint)
}
