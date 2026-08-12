package ec.edu.puce.matchpoint

import android.os.Bundle
import android.os.Build
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.Alignment
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import ec.edu.puce.matchpoint.data.models.UserRole
import ec.edu.puce.matchpoint.ui.UiState
import ec.edu.puce.matchpoint.ui.navigation.Route
import ec.edu.puce.matchpoint.ui.screens.*
import ec.edu.puce.matchpoint.ui.theme.MatchPointTheme
import ec.edu.puce.matchpoint.viewmodel.*

class MainActivity:ComponentActivity(){override fun onCreate(savedInstanceState:Bundle?){super.onCreate(savedInstanceState);enableEdgeToEdge();if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.Q)window.isNavigationBarContrastEnforced=false;val factory=MatchPointViewModelFactory((application as MatchPointApplication).container);setContent{MatchPointTheme{val auth:AuthViewModel=viewModel(factory=factory);val content:ContentViewModel=viewModel(factory=factory);MatchPointApp(auth,content)}}}}

@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun MatchPointApp(auth:AuthViewModel,content:ContentViewModel){
    val authState by auth.state.collectAsState();val nav=rememberNavController();val role=(authState as? UiState.Success)?.data
    LaunchedEffect(role){nav.navigate(if(role==null)Route.Login.path else Route.Home.path){popUpTo(0)}}
    val back by nav.currentBackStackEntryAsState();val current=back?.destination?.route;val snackbar=remember{SnackbarHostState()};val message by content.message.collectAsState()
    LaunchedEffect(message){message?.let{snackbar.showSnackbar(it);content.message.value=null}}
    val username=(applicationContainer().session.username)
    val destinations=if(role==UserRole.PLAYER)listOf(Triple(Route.Home,Icons.Default.Home,"Inicio"),Triple(Route.Courts,Icons.Default.Place,"Canchas"),Triple(Route.Reservations,Icons.Default.Event,"Reservas"),Triple(Route.Tournaments,Icons.Default.EmojiEvents,"Torneos"),Triple(Route.Profile,Icons.Default.Person,"Perfil"))else listOf(Triple(Route.Home,Icons.Default.Home,"Inicio"),Triple(Route.Courts,Icons.Default.Place,"Canchas"),Triple(Route.Tournaments,Icons.Default.EmojiEvents,"Torneos"),Triple(Route.Profile,Icons.Default.Person,"Perfil"))
    Scaffold(containerColor=MaterialTheme.colorScheme.background,topBar={if(role!=null)CenterAlignedTopAppBar(title={Row(verticalAlignment=Alignment.CenterVertically){Icon(Icons.Default.SportsBasketball,null,tint=MaterialTheme.colorScheme.primary);Text(" MatchPoint",style=MaterialTheme.typography.titleLarge)}})},bottomBar={if(role!=null)NavigationBar(containerColor=MaterialTheme.colorScheme.surfaceContainer){destinations.forEach{(r,icon,label)->NavigationBarItem(current==r.path,{nav.navigate(r.path){popUpTo(Route.Home.path){saveState=true};launchSingleTop=true;restoreState=true}}, {Icon(icon,label)},label={Text(label)},alwaysShowLabel=current==r.path)}}},snackbarHost={SnackbarHost(snackbar)}){padding->
        NavHost(nav,Route.Login.path,Modifier.padding(padding)){
            composable(Route.Login.path){LoginScreen(auth)}
            composable(Route.Home.path){role?.let{HomeScreen(content,it,username,nav::navigate)}}
            composable(Route.Courts.path){role?.let{CourtsScreen(content,it,username)}}
            composable(Route.Reservations.path){ReservationsScreen(content)}
            composable(Route.Tournaments.path){role?.let{TournamentsScreen(content,it,username)}}
            composable(Route.Profile.path){role?.let{ProfileScreen(content,it,auth::logout)}}
        }
    }
}

@Composable private fun applicationContainer()=(androidx.compose.ui.platform.LocalContext.current.applicationContext as MatchPointApplication).container
