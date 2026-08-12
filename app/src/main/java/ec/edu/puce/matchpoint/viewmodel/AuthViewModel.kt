package ec.edu.puce.matchpoint.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ec.edu.puce.matchpoint.data.models.UserRole
import ec.edu.puce.matchpoint.data.remote.ApiResult
import ec.edu.puce.matchpoint.data.repository.AuthRepository
import ec.edu.puce.matchpoint.ui.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AuthViewModel(private val repository: AuthRepository): ViewModel() {
    private val _state = MutableStateFlow<UiState<UserRole>>(repository.role()?.let { UiState.Success(it) } ?: UiState.Idle)
    val state: StateFlow<UiState<UserRole>> = _state
    fun login(user: String, password: String) = viewModelScope.launch {
        if (user.isBlank() || password.length < 6) { _state.value = UiState.Error("Ingresa usuario y contraseña válida."); return@launch }
        _state.value = UiState.Loading
        _state.value = when(val result = repository.login(user.trim(), password)) { is ApiResult.Success -> UiState.Success(result.data); is ApiResult.Error -> UiState.Error(result.message,result.code) }
    }
    fun logout() { repository.logout(); _state.value = UiState.Idle }
}
