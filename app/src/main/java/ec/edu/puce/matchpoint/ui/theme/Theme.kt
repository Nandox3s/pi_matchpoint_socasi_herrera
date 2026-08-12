package ec.edu.puce.matchpoint.ui.theme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
private val Colors = lightColorScheme(primary=Color(0xFF156B4A),secondary=Color(0xFFF39C12),background=Color(0xFFF4F7F5),surface=Color.White)
@Composable fun MatchPointTheme(content: @Composable () -> Unit) = MaterialTheme(colorScheme = Colors, content = content)
