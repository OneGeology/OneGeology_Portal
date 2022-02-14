package fr.brgm.mapClient.wms.validation;

import com.google.common.collect.Maps;
import fr.brgm.mapClient.wms.validation.dto.WmsErrorDTO;
import fr.brgm.mapClient.wms.validation.dto.WmsStatusDTO;
import org.assertj.core.util.Lists;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * Test class for {@link WmsValidationController}
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class WmsValidationControllerTest extends Mockito {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Controller to test
     */
    @InjectMocks
    private WmsValidationController wmsValidationController;

    /**
     * Service to mock
     */
    @Mock
    private WmsValidationService wmsValidationService;

    /**
     * Mock {@link WmsStatusDTO}
     */
    private WmsStatusDTO mockWmsStatusDTO() {
        WmsStatusDTO wmsStatusDTO = new WmsStatusDTO();
        wmsStatusDTO.setValid(false);
        wmsStatusDTO.setErrors(Maps.newHashMap());
        wmsStatusDTO.getErrors().put("layer1", Lists.newArrayList(new WmsErrorDTO("Error layer 1")));
        return wmsStatusDTO;
    }

    /**
     * Set up
     */
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(this.wmsValidationController).build();

        ReflectionTestUtils.setField(this.wmsValidationController, "wmsValidationService", this.wmsValidationService);

        when(this.wmsValidationService.validateWms(anyString())).thenReturn(this.mockWmsStatusDTO());
    }

    /**
     * Test validateWms
     */
    @Test
    public void whenValidateWmsShouldReturnWhetherWmsIsValidOrNot() throws Exception {
        this.mockMvc.perform(MockMvcRequestBuilders.post("/api/wms/validation/")
                .contentType(MediaType.APPLICATION_JSON_VALUE).content("https://onegeology-asia.org/ows/GSJ_Geological_Maps/wms?service=WMS&request=GetCapabilities"))
                .andExpect(MockMvcResultMatchers.status().is(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.valid").value(false))
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.errors.layer1[0].error").value("Error layer 1"));
    }

}
