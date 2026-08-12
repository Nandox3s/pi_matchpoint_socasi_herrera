package ec.edu.puce.matchpoint.utils
import org.junit.Assert.*
import org.junit.Test
import java.time.LocalDateTime
class ValidatorsTest {
 @Test fun validProfilePasses(){assertNull(Validators.profile("Ana Pérez","ana@puce.edu.ec","0999555666"))}
 @Test fun invalidEmailFails(){assertNotNull(Validators.profile("Ana","correo","0999555666"))}
 @Test fun invalidCourtPriceFails(){assertNotNull(Validators.court("Central","Norte","Parquet",0.0))}
 @Test fun pastReservationFails(){assertNotNull(Validators.reservation(1,LocalDateTime.now().minusDays(1).toString(),60))}
 @Test fun futureReservationPasses(){assertNull(Validators.reservation(1,LocalDateTime.now().plusDays(1).toString(),60))}
 @Test fun tournamentCapacityMustBePowerOfTwo(){assertNotNull(Validators.tournament("Copa",6));assertNull(Validators.tournament("Copa",8))}
 @Test fun negativeAndTieScoresFail(){assertNotNull(Validators.score(-1,2));assertNotNull(Validators.score(2,2));assertNull(Validators.score(3,2))}
}
