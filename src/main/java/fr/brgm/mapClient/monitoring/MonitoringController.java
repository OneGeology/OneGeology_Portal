package fr.brgm.mapClient.monitoring;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.monitoring.dto.MonitoringDTO;
import fr.brgm.mapClient.monitoring.dto.request.TemplateRequestDTO;
import fr.brgm.mapClient.monitoring.dto.response.TemplateResponseDTO;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.exception.MultipleResultException;
import io.swagger.annotations.*;
import lombok.AllArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Rest controller to handle services from Zabbix using a h2 in-memory database combined with a scheduler to update the application
 */
@RestController
@AllArgsConstructor
@RequestMapping("/monitoring")
@Api(value = "/monitoring", description = "Controller used to monitor services SLA")
public class MonitoringController {

    private final static Log log = LogFactory.getLog(MonitoringController.class);

    private final ApplicationProperties applicationProperties;

    private final MonitoringService monitoringService;


    /**
     * Get all services with their SLAs
     *
     * @return all services with their SLAs
     */
    @GetMapping("/")
    @ApiOperation(value = "Get all services with their SLAs", httpMethod = "GET", response = MonitoringDTO.class)
    @ApiResponse(code = 200, response = MonitoringDTO.class, message = "Responce class containing all services with their SLAs")
    public MonitoringDTO monitoring() {
        MonitoringDTO monitoringDTO = new MonitoringDTO();
        monitoringDTO.setDayInterval(this.applicationProperties.getZabbix().getScheduler().getDayInterval());
        monitoringDTO.setMonitoring(this.monitoringService.getAllSLAs());
        return monitoringDTO;
    }

    /**
     * Creation of all services inside template object
     *
     * @param templateRequestDTO Template containing all services we need to create
     * @return Response class containing all created Ids
     */
    @PostMapping("/")
    @ApiOperation(value = "Creation of all services inside template object", httpMethod = "POST", response = TemplateResponseDTO.class)
    @ApiResponses({
            @ApiResponse(code = 200, response = TemplateResponseDTO.class, message = "Responce class containing all created Ids"),
            @ApiResponse(code = 500, response = MultipleResultException.class, message = "Error when a get request on Zabbix returns more than one element")
    })
    public TemplateResponseDTO monitoring(@ApiParam(value = "Template to create every services on Zabbix", required = true) @Valid @RequestBody TemplateRequestDTO templateRequestDTO) {
        log.debug(String.format("Template received: %s", templateRequestDTO.toString()));
        TemplateResponseDTO templateResponseDTO = this.monitoringService.monitoring(templateRequestDTO);
        log.debug(String.format("Returning: %s", templateResponseDTO));
        return templateResponseDTO;
    }
}
