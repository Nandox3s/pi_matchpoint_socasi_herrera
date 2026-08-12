package ec.edu.puce.matchpoint.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import ec.edu.puce.matchpoint.AppContainer

class MatchPointViewModelFactory(private val c: AppContainer): ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST") override fun <T: ViewModel> create(modelClass: Class<T>): T = when {
        modelClass.isAssignableFrom(AuthViewModel::class.java) -> AuthViewModel(c.auth)
        modelClass.isAssignableFrom(ContentViewModel::class.java) -> ContentViewModel(c.users,c.courts,c.reservations,c.tournaments)
        else -> error("Unknown ViewModel")
    } as T
}
