package ec.edu.puce.matchpoint.data
import ec.edu.puce.matchpoint.data.remote.ApiErrorMapper
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.ResponseBody.Companion.toResponseBody
import org.junit.Assert.*
import org.junit.Test
import retrofit2.HttpException
import retrofit2.Response
class ApiErrorMapperTest {
 private fun error(code:Int,body:String="{}")=ApiErrorMapper.map(HttpException(Response.error<Unit>(code,body.toResponseBody("application/json".toMediaType()))))
 @Test fun mapsAuthAndPermissionErrors(){assertEquals("Tu sesión expiró. Inicia sesión nuevamente.",error(401).message);assertEquals("No tienes permisos para realizar esta acción.",error(403).message)}
 @Test fun mapsBookingConflict(){assertEquals("Esta cancha ya está reservada en ese horario.",error(409,"{\"error\":\"Court is already booked\"}").message)}
 @Test fun mapsServiceUnavailable(){assertEquals("El servicio no está disponible temporalmente.",error(503).message)}
}
