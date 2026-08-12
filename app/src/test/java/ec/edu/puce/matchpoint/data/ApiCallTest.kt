package ec.edu.puce.matchpoint.data

import ec.edu.puce.matchpoint.data.remote.ApiResult
import ec.edu.puce.matchpoint.data.remote.apiCall
import java.io.IOException
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ApiCallTest {
    @Test fun `successful 200 response is exposed as success`() = runTest {
        val result = apiCall { "OK" }
        assertTrue(result is ApiResult.Success)
        assertEquals("OK", (result as ApiResult.Success).data)
    }

    @Test fun `successful 201 creation is exposed as success`() = runTest {
        val result = apiCall { 201L }
        assertEquals(201L, (result as ApiResult.Success).data)
    }

    @Test fun `network failure becomes actionable error`() = runTest {
        val result = apiCall<String> { throw IOException("offline") }
        assertEquals("No se pudo conectar con el servidor. Revisa tu conexión.", (result as ApiResult.Error).message)
    }
}
