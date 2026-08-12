package ec.edu.puce.matchpoint.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.unit.dp

private val Green = Color(0xFF087A55)
private val Orange = Color(0xFFFFA928)
private val Light = lightColorScheme(primary=Green,onPrimary=Color.White,primaryContainer=Color(0xFFD1F3E4),onPrimaryContainer=Color(0xFF002116),secondary=Orange,background=Color(0xFFF7FAF8),surface=Color.White,surfaceVariant=Color(0xFFE8F0EB),error=Color(0xFFBA1A1A))
private val Dark = darkColorScheme(primary=Color(0xFF69DBAD),onPrimary=Color(0xFF003825),secondary=Color(0xFFFFB95B),background=Color(0xFF101512),surface=Color(0xFF171D19),surfaceVariant=Color(0xFF26332C))

@Composable fun MatchPointTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) { MaterialTheme(colorScheme = if(darkTheme) Dark else Light, typography = Typography(), shapes = Shapes(small = RoundedCornerShape(12.dp), medium = RoundedCornerShape(18.dp), large = RoundedCornerShape(28.dp)), content = content) }
