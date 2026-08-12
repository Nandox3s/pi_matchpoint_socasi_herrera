package ec.edu.puce.matchpoint.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ec.edu.puce.matchpoint.data.models.*
import ec.edu.puce.matchpoint.data.remote.ApiResult
import ec.edu.puce.matchpoint.data.repository.*
import ec.edu.puce.matchpoint.ui.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ContentViewModel(private val users: UserRepository, private val courtsRepo: CourtRepository, private val reservationsRepo: ReservationRepository, private val tournamentsRepo: TournamentRepository): ViewModel() {
    private val _courts = MutableStateFlow<UiState<List<CourtResponse>>>(UiState.Idle); val courts: StateFlow<UiState<List<CourtResponse>>> = _courts
    private val _availableCourts = MutableStateFlow<UiState<List<CourtResponse>>>(UiState.Idle); val availableCourts: StateFlow<UiState<List<CourtResponse>>> = _availableCourts
    private val _reservations = MutableStateFlow<UiState<List<ReservationResponse>>>(UiState.Idle); val reservations: StateFlow<UiState<List<ReservationResponse>>> = _reservations
    private val _tournaments = MutableStateFlow<UiState<List<TournamentResponse>>>(UiState.Idle); val tournaments: StateFlow<UiState<List<TournamentResponse>>> = _tournaments
    private val _profile = MutableStateFlow<UiState<UserResponse>>(UiState.Idle); val profile: StateFlow<UiState<UserResponse>> = _profile
    private val _tournamentDetail = MutableStateFlow<UiState<TournamentProgressResponse>>(UiState.Idle); val tournamentDetail: StateFlow<UiState<TournamentProgressResponse>> = _tournamentDetail
    private val _teams = MutableStateFlow<UiState<List<TeamResponse>>>(UiState.Idle); val teams: StateFlow<UiState<List<TeamResponse>>> = _teams
    val pendingCourt = MutableStateFlow<CourtResponse?>(null)
    val message = MutableStateFlow<String?>(null)
    fun loadCourts(sector: String? = null) = launch(_courts) { courtsRepo.list(sector?.takeIf(String::isNotBlank)) }
    fun loadAvailableCourts(sector: String?, startsAt: String, duration: Int) = launch(_availableCourts) { courtsRepo.available(sector?.takeIf(String::isNotBlank),SportType.BASKET,startsAt,duration) }
    fun loadReservations() = launch(_reservations) { reservationsRepo.mine() }
    fun loadTournaments() = launch(_tournaments) { tournamentsRepo.list() }
    fun loadTournament(id: Long) = launch(_tournamentDetail) { tournamentsRepo.detail(id) }
    fun loadTeams(id: Long) = launch(_teams) { tournamentsRepo.teams(id) }
    fun loadProfile() = launch(_profile) { users.profile() }
    fun saveProfile(body: UserRequest, create: Boolean) = viewModelScope.launch { notify(if(create) users.create(body) else users.update(body)); loadProfile() }
    fun reserve(body: CreateReservationRequest) = viewModelScope.launch { notify(reservationsRepo.create(body)); loadReservations() }
    fun cancel(id: Long) = viewModelScope.launch { notify(reservationsRepo.cancel(id)); loadReservations() }
    fun createCourt(body: CreateCourtRequest) = viewModelScope.launch { notify(courtsRepo.create(body)); loadCourts() }
    fun updateCourt(id: Long, body: UpdateCourtRequest, active: Boolean) = viewModelScope.launch { notify(courtsRepo.update(id,body),if(active)"Cancha actualizada." else "Cancha desactivada.");loadCourts() }
    fun createTournament(body: CreateTournamentRequest) = viewModelScope.launch { notify(tournamentsRepo.create(body)); loadTournaments() }
    fun registerTeam(id: Long, body: RegisterTeamRequest) = viewModelScope.launch { notify(tournamentsRepo.register(id, body),"Equipo inscrito.") }
    fun startTournament(id: Long) = viewModelScope.launch { notify(tournamentsRepo.start(id)); loadTournaments() }
    fun scheduleMatch(tournamentId: Long, matchId: Long, date: String) = viewModelScope.launch { notify(tournamentsRepo.schedule(matchId,date)); loadTournament(tournamentId) }
    fun scoreMatch(tournamentId: Long, matchId: Long, home: Int, away: Int) = viewModelScope.launch { notify(tournamentsRepo.score(matchId,home,away)); loadTournament(tournamentId); loadTournaments() }
    private fun <T> launch(flow: MutableStateFlow<UiState<T>>, call: suspend () -> ApiResult<T>) = viewModelScope.launch { flow.value=UiState.Loading; flow.value=when(val r=call()){is ApiResult.Success->UiState.Success(r.data);is ApiResult.Error->UiState.Error(r.message,r.code)} }
    private fun notify(r: ApiResult<*>,success:String="Operación completada correctamente.") { message.value = if(r is ApiResult.Error) r.message else success }
}
