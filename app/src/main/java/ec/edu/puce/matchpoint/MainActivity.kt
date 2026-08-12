package ec.edu.puce.matchpoint

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import ec.edu.puce.matchpoint.data.models.UserRole
import ec.edu.puce.matchpoint.ui.UiState
import ec.edu.puce.matchpoint.ui.navigation.Route
import ec.edu.puce.matchpoint.ui.screens.*
import ec.edu.puce.matchpoint.ui.theme.MatchPointTheme
import ec.edu.puce.matchpoint.viewmodel.*

class MainActivity:ComponentActivity(){override fun onCreate(savedInstanceState:Bundle?){super.onCreate(savedInstanceState);val factory=MatchPointViewModelFactory((application as MatchPointApplication).container);setContent{MatchPointTheme{val auth:AuthViewModel=viewModel(factory=factory);val content:ContentViewModel=viewModel(factory=factory);MatchPointApp(auth,content)}}}}

@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun MatchPointApp(auth:AuthViewModel,content:ContentViewModel){
    val authState by auth.state.collectAsState();val nav=rememberNavController();val role=(authState as? UiState.Success)?.data
    LaunchedEffect(role){nav.navigate(if(role==null)Route.Login.path else Route.Home.path){popUpTo(0)}}
    val back by nav.currentBackStackEntryAsState();val current=back?.destination?.route;val snackbar=remember{SnackbarHostState()};val message by content.message.collectAsState()
    LaunchedEffect(message){message?.let{snackbar.showSnackbar(it);content.message.value=null}}
    Scaffold(topBar={if(role!=null)TopAppBar(title={Text(current?.replaceFirstChar{it.uppercase()}?:"MatchPoint")},actions={IconButton({auth.logout()}){Icon(Icons.Default.Logout,"Cerrar sesión")}})},bottomBar={if(role!=null)NavigationBar{listOf(Route.Home to Icons.Default.Home,Route.Courts to Icons.Default.Place,Route.Tournaments to Icons.Default.EmojiEvents,Route.Profile to Icons.Default.Person).forEach{(r,icon)->NavigationBarItem(current==r.path,{nav.navigate(r.path){launchSingleTop=true}}, {Icon(icon,r.path)},label={Text(r.path)})}}},snackbarHost={SnackbarHost(snackbar)}){padding->
        NavHost(nav,Route.Login.path,Modifier.padding(padding)){
            composable(Route.Login.path){LoginScreen(auth)}
            composable(Route.Home.path){role?.let{HomeScreen(it,nav::navigate)}}
            composable(Route.Courts.path){role?.let{CourtsScreen(content,it)}}
            composable(Route.Reservations.path){ReservationsScreen(content)}
            composable(Route.Tournaments.path){role?.let{TournamentsScreen(content,it)}}
            composable(Route.Profile.path){ProfileScreen(content)}
        }
    }
}
