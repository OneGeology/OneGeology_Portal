package fr.brgm.mapClient.monitoring;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.monitoring.dto.request.ServiceRequestDTO;
import fr.brgm.mapClient.monitoring.dto.request.TemplateRequestDTO;
import fr.brgm.mapClient.monitoring.dto.response.ServiceResponseDTO;
import fr.brgm.mapClient.monitoring.dto.response.TemplateResponseDTO;
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

import java.util.Collections;
import java.util.List;

/**
 * TestSld class for {@link MonitoringController}
 */
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class MonitoringControllerTest extends Mockito {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApplicationProperties applicationProperties;

    /**
     * Controller to test
     */
    @InjectMocks
    private MonitoringController monitoringController;

    /**
     * ServiceDTO to mock
     */
    @Mock
    private MonitoringService monitoringService;

    /**
     * Mocking a TemplateResponseDTO
     */
    private TemplateResponseDTO createTemplateResponse() {
        ServiceResponseDTO serviceResponseDTO = new ServiceResponseDTO();
        serviceResponseDTO.setScenarioId(4L);
        serviceResponseDTO.setTriggerId(5L);
        serviceResponseDTO.setServiceId(6L);

        TemplateResponseDTO templateResponseDTO = new TemplateResponseDTO();
        templateResponseDTO.setTemplateId(1L);
        templateResponseDTO.setApplicationId(2L);
        templateResponseDTO.setServiceClusterId(3L);
        templateResponseDTO.setServices(Collections.singletonList(serviceResponseDTO));
        return templateResponseDTO;
    }

    /**
     * Mocking a list of serviceDTO
     */
    private List<fr.brgm.mapClient.monitoring.dto.ServiceDTO> createMonitoringDTO() {
        fr.brgm.mapClient.monitoring.dto.ServiceDTO serviceDTO = new fr.brgm.mapClient.monitoring.dto.ServiceDTO();
        serviceDTO.setName("Service 1");
        serviceDTO.setSla(95.2f);

        fr.brgm.mapClient.monitoring.dto.ServiceDTO serviceDTO2 = new fr.brgm.mapClient.monitoring.dto.ServiceDTO();
        serviceDTO2.setName("Service 2");
        serviceDTO2.setSla(95.22f);

        return Lists.newArrayList(serviceDTO, serviceDTO2);
    }

    /**
     * Set up
     */
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(this.monitoringController).build();

        ReflectionTestUtils.setField(this.monitoringController, "applicationProperties", this.applicationProperties);
        ReflectionTestUtils.setField(this.monitoringController, "monitoringService", this.monitoringService);

        when(this.monitoringService.monitoring(any(TemplateRequestDTO.class))).thenReturn(this.createTemplateResponse());
        when(this.monitoringService.getAllSLAs()).thenReturn(this.createMonitoringDTO());
    }

    /**
     * Testing /monitoring with valid data
     *
     * @throws Exception
     */
    @Test
    public void whenMonitoringValidInputDataShouldReturnValidData() throws Exception {
        ServiceRequestDTO serviceRequestDTO = new ServiceRequestDTO();
        serviceRequestDTO.setName("name");
        serviceRequestDTO.setScenarioName("scenarioName");
        serviceRequestDTO.setStepName("stepName");
        serviceRequestDTO.setStepStatusCode("200");
        serviceRequestDTO.setTriggerName("triggerName");
        serviceRequestDTO.setUrl("url");

        TemplateRequestDTO templateRequestDTO = new TemplateRequestDTO();
        templateRequestDTO.setApplicationName("applicationName");
        templateRequestDTO.setGroupId(15L);
        templateRequestDTO.setHostId(10084L);
        templateRequestDTO.setTemplateName("templateName");
        templateRequestDTO.setServices(Collections.singletonList(serviceRequestDTO));

        ObjectMapper mapper = new ObjectMapper();

        this.mockMvc.perform(MockMvcRequestBuilders.post("/monitoring/")
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(mapper.writeValueAsString(templateRequestDTO)))
                .andExpect(MockMvcResultMatchers.status().is(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.templateId").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.applicationId").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.serviceClusterId").value(3))
                .andExpect(MockMvcResultMatchers.jsonPath("$.services[0].scenarioId").value(4))
                .andExpect(MockMvcResultMatchers.jsonPath("$.services[0].triggerId").value(5))
                .andExpect(MockMvcResultMatchers.jsonPath("$.services[0].serviceId").value(6));
    }

    /**
     * Testing GET /monitoring
     *
     * @throws Exception
     */
    @Test
    public void whenGetAllServicesSlasShouldReturnAllServicesWithTheirSla() throws Exception {
        this.mockMvc.perform(MockMvcRequestBuilders.get("/monitoring/"))
                .andExpect(MockMvcResultMatchers.status().is(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.dayInterval").value(this.applicationProperties.getZabbix().getScheduler().getDayInterval()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.monitoring[0].name").value("Service 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.monitoring[0].sla").value(95.2f))
                .andExpect(MockMvcResultMatchers.jsonPath("$.monitoring[1].name").value("Service 2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.monitoring[1].sla").value(95.22f));

    }

}
