package ec.edu.puce.matchpoint.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Green = Color(0xFF087A55)
private val Orange = Color(0xFFFFA928)
private val Light = lightColorScheme(primary=Green,onPrimary=Color.White,primaryContainer=Color(0xFFD1F3E4),onPrimaryContainer=Color(0xFF002116),secondary=Orange,tertiary=Color(0xFF005C73),background=Color(0xFFF7FAF8),surface=Color.White,surfaceVariant=Color(0xFFE8F0EB),error=Color(0xFFBA1A1A))
private val Dark = darkColorScheme(primary=Color(0xFF69DBAD),onPrimary=Color(0xFF003825),secondary=Color(0xFFFFB95B),tertiary=Color(0xFF62D4F3),background=Color(0xFF101512),surface=Color(0xFF171D19),surfaceVariant=Color(0xFF26332C))

private val MatchPointTypography = Typography(
    displaySmall=TextStyle(fontWeight=FontWeight.Black,fontSize=40.sp,lineHeight=44.sp,letterSpacing=(-1).sp),
    headlineMedium=TextStyle(fontWeight=FontWeight.ExtraBold,fontSize=28.sp,lineHeight=34.sp,letterSpacing=(-0.5).sp),
    titleLarge=TextStyle(fontWeight=FontWeight.Bold,fontSize=21.sp,lineHeight=27.sp),
    titleMedium=TextStyle(fontWeight=FontWeight.SemiBold,fontSize=17.sp,lineHeight=23.sp),
    bodyLarge=TextStyle(fontWeight=FontWeight.Normal,fontSize=16.sp,lineHeight=24.sp),
    labelLarge=TextStyle(fontWeight=FontWeight.Bold,fontSize=14.sp,lineHeight=20.sp,letterSpacing=0.2.sp)
)
@Composable fun MatchPointTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) { MaterialTheme(colorScheme = if(darkTheme) Dark else Light, typography = MatchPointTypography, shapes = Shapes(extraSmall=RoundedCornerShape(10.dp),small = RoundedCornerShape(14.dp), medium = RoundedCornerShape(22.dp), large = RoundedCornerShape(32.dp),extraLarge=RoundedCornerShape(40.dp)), content = content) }
