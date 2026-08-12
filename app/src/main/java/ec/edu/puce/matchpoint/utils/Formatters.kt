package ec.edu.puce.matchpoint.utils
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
object Formatters { private val locale=Locale("es","EC"); private val date=DateTimeFormatter.ofPattern("d MMM yyyy",locale); private val time=DateTimeFormatter.ofPattern("HH:mm",locale); fun dateTime(raw:String): Pair<String, String> = runCatching { LocalDateTime.parse(raw).let { it.format(date) to it.format(time) } }.getOrDefault(raw to "") }
