package ec.edu.puce.matchpoint.utils

import org.junit.Assert.assertEquals
import org.junit.Test

class FormattersTest {
    @Test fun `formats backend local date time for users`() {
        val result = Formatters.dateTime("2026-08-20T18:30:00")
        assertEquals("20 ago 2026", result.first)
        assertEquals("18:30", result.second)
    }
}
