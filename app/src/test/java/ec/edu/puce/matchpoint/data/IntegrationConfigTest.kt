package ec.edu.puce.matchpoint.data

import ec.edu.puce.matchpoint.data.remote.IntegrationConfig
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test

class IntegrationConfigTest {
    @Test fun `requires Cognito region and public client`() {
        assertNotNull(IntegrationConfig.authError("", "client"))
        assertNotNull(IntegrationConfig.authError("us-east-1", ""))
        assertNull(IntegrationConfig.authError("us-east-1", "public-client"))
    }

    @Test fun `requires absolute API URL with trailing slash`() {
        assertNotNull(IntegrationConfig.apiError("18.234.231.25:9090"))
        assertNotNull(IntegrationConfig.apiError("http://18.234.231.25:9090"))
        assertNull(IntegrationConfig.apiError("http://18.234.231.25:9090/"))
    }
}
