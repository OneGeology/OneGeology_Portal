package fr.brgm.mapClient.wms.validation;

import fr.brgm.mapClient.wms.validation.dto.WmsErrorDTO;
import fr.brgm.mapClient.wms.validation.dto.WmsStatusDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Test class for {@link WmsValidationService}
 */
@SpringBootTest
public class WmsValidationServiceIntegrationTest {

    @Autowired
    private WmsValidationService wmsValidationService;

    /**
     * Japan (service) -> Japan (M49)
     */
    @Test @Disabled("This service is not currently operating. Investigate an alternative to test against later.")
    public void whenValidateJapanWmsShouldReturnThatWmsIsValid() {
        WmsStatusDTO wmsStatusDTO = this.wmsValidationService.validateWms("https://onegeology-asia.org/ows/GSJ_Geological_Maps/wms?service=WMS&request=GetCapabilities");
        Assertions.assertNotNull(wmsStatusDTO);
        Assertions.assertTrue(wmsStatusDTO.isValid());
    }

    /**
     * Vietnam (service) -> Viet Nam (M49)
     */
    @Test @Disabled("This service is not currently operating. Investigate an alternative to test against later.")
    public void whenValidateVietnamWmsShouldReturnThatWmsIsNotValid() {
        WmsStatusDTO wmsStatusDTO = this.wmsValidationService.validateWms("http://onegeology-asia.org/ows/GSJ_DGMV_Combined_Bedrock_and_Superficial_Geology_and_Age/wms?service=WMS&request=GetCapabilities");
        Assertions.assertNotNull(wmsStatusDTO);
        Assertions.assertFalse(wmsStatusDTO.isValid());

        boolean geographicareaError = wmsStatusDTO.getErrors().get("VNM_DGMV_1M_Combined_BLT_SLT_BA").stream()
                .map(WmsErrorDTO::getError)
                .anyMatch("Wrong value found for keyword geographicarea@"::equals);
        Assertions.assertTrue(geographicareaError);
    }

}
