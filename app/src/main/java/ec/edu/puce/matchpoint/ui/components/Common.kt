package ec.edu.puce.matchpoint.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.unit.dp
import ec.edu.puce.matchpoint.ui.UiState

@Composable fun <T> StateView(state: UiState<T>, empty: (T) -> Boolean = { false }, content: @Composable (T) -> Unit) { when(state) { UiState.Idle -> Unit; UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }; is UiState.Error -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text(state.message, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(24.dp)) }; is UiState.Success -> if(empty(state.data)) Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("No hay información disponible.") } else content(state.data) } }
@Composable fun Label(text:String){Text(text,style=MaterialTheme.typography.labelMedium,color=MaterialTheme.colorScheme.primary)}
@Composable fun ConfirmDialog(title:String,text:String,onDismiss:()->Unit,onConfirm:()->Unit){AlertDialog(onDismissRequest=onDismiss,title={Text(title)},text={Text(text)},confirmButton={TextButton(onClick=onConfirm){Text("Confirmar")}},dismissButton={TextButton(onClick=onDismiss){Text("Cancelar")}})}
