package ec.edu.puce.matchpoint.ui.navigation
sealed class Route(val path:String){ data object Login:Route("login");data object Home:Route("home");data object Courts:Route("courts");data object Reservations:Route("reservations");data object Tournaments:Route("tournaments");data object Profile:Route("profile") }
