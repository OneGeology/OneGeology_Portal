package fr.brgm.mapClient.wms.validation;

import fr.brgm.mapClient.wms.validation.dto.WmsErrorDTO;
import fr.brgm.mapClient.wms.validation.dto.WmsStatusDTO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Test class for {@link WmsValidationService}
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class WmsValidationServiceIntegrationTest {

    @Autowired
    private WmsValidationService wmsValidationService;

    /**
     * Japan (service) -> Japan (M49)
     */
    @Test
    public void whenValidateJapanWmsShouldReturnThatWmsIsValid() {
        WmsStatusDTO wmsStatusDTO = this.wmsValidationService.validateWms("https://onegeology-asia.org/ows/GSJ_Geological_Maps/wms?service=WMS&request=GetCapabilities");
        Assert.assertNotNull(wmsStatusDTO);
        Assert.assertTrue(wmsStatusDTO.isValid());
    }

    /**
     * Vietnam (service) -> Viet Nam (M49)
     */
    @Test
    public void whenValidateVietnamWmsShouldReturnThatWmsIsNotValid() {
        WmsStatusDTO wmsStatusDTO = this.wmsValidationService.validateWms("http://onegeology-asia.org/ows/GSJ_DGMV_Combined_Bedrock_and_Superficial_Geology_and_Age/wms?service=WMS&request=GetCapabilities");
        Assert.assertNotNull(wmsStatusDTO);
        Assert.assertFalse(wmsStatusDTO.isValid());

        boolean geographicareaError = wmsStatusDTO.getErrors().get("VNM_DGMV_1M_Combined_BLT_SLT_BA").stream()
                .map(WmsErrorDTO::getError)
                .anyMatch("Wrong value found for keyword geographicarea@"::equals);
        Assert.assertTrue(geographicareaError);
    }

}
