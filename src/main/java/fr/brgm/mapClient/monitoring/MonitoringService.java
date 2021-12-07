package fr.brgm.mapClient.monitoring;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.monitoring.dao.ServiceDAO;
import fr.brgm.mapClient.monitoring.dto.ServiceDTO;
import fr.brgm.mapClient.monitoring.dto.request.ServiceRequestDTO;
import fr.brgm.mapClient.monitoring.dto.request.TemplateRequestDTO;
import fr.brgm.mapClient.monitoring.dto.response.ServiceResponseDTO;
import fr.brgm.mapClient.monitoring.dto.response.TemplateResponseDTO;
import fr.brgm.mapClient.monitoring.zabbixapiclient.ZabbixService;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.*;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.exception.MultipleResultException;
import lombok.AllArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@AllArgsConstructor
public class MonitoringService {

    private final static Log log = LogFactory.getLog(MonitoringService.class);

    private final ApplicationProperties applicationProperties;
    private final ZabbixService zabbixService;
    private final ServiceRepository serviceRepository;


    /**
     * Create filters and params to get or create a template
     *
     * @param name    TemplateDTO's name
     * @param groupId Id of the parent group
     * @param hostId  Id of the parent host
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createTemplateObjectRequest(String name, Long groupId, Long hostId) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("name", name);
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("host", name);
        zabbixObjectRequest.getParams().put("groups", new Group(groupId));
        zabbixObjectRequest.getParams().put("hosts", new Host(hostId));
        return zabbixObjectRequest;
    }

    /**
     * Create filters and params to get or create an application
     *
     * @param name       Application's name
     * @param templateId Id of the parent template
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createApplicationObjectRequest(String name, Long templateId) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("name", name);
        zabbixObjectRequest.getFilter().put("hostid", templateId.toString());
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("name", name);
        zabbixObjectRequest.getParams().put("hostid", templateId);
        return zabbixObjectRequest;
    }

    /**
     * Create filters and params to get or create the parent service (It will contain all the services)
     *
     * @param name Services cluster's name
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createServicesClusterObjectRequest(String name) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("name", name);
        zabbixObjectRequest.getFilter().put("templateid", "0");
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("name", name);
        zabbixObjectRequest.getParams().put("algorithm", 1);
        zabbixObjectRequest.getParams().put("showsla", 0);
        zabbixObjectRequest.getParams().put("sortorder", 0);
        return zabbixObjectRequest;
    }

    /**
     * Create filters and params to get or create a scenario
     *
     * @param name           Scenario's name
     * @param stepName       Step's name
     * @param url            Url we need to test
     * @param stepStatusCode Status code to be checked by the step
     * @param templateId     Id of the parent template
     * @param applicationId  Id of the parent application
     * @param cpt            Compteur pour changer le nom des scénarios
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createScenarioObjectRequest(String name, String stepName, String url, String stepStatusCode, Long templateId, Long applicationId, Integer cpt) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        Step step = new Step();
        step.setName(stepName);
        step.setNo(1);
        step.setUrl(url);
        step.setRequired("</Layer>");
        step.setStatusCodes(stepStatusCode);
        // Creating filter to search scenarios
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("name", name + cpt);
        zabbixObjectRequest.getFilter().put("hostid", templateId.toString());
        // Creating scenario params
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("name", name + cpt);
        zabbixObjectRequest.getParams().put("hostid", templateId);
        zabbixObjectRequest.getParams().put("applicationid", applicationId);
        zabbixObjectRequest.getParams().put("http_proxy", this.applicationProperties.getZabbix().getProxy());
        zabbixObjectRequest.getParams().put("delay", this.applicationProperties.getZabbix().getScenarioDelay());
        zabbixObjectRequest.getParams().put("steps", Collections.singletonList(step));
        return zabbixObjectRequest;
    }

    /**
     * Create filters and params to get or create a trigger
     *
     * @param triggerName  Trigger's name
     * @param templateName Template's name
     * @param scenarioName Scenario's name
     * @param cpt          Compteur pour changer le nom des triggers
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createTriggerObjectRequest(String triggerName, String templateName, String scenarioName, Integer cpt) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("description", triggerName + cpt);
        // Déclencheur parent
        zabbixObjectRequest.getFilter().put("templateid", "0");
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("description", triggerName + cpt);
        zabbixObjectRequest.getParams().put("expression", String.format("{%s:web.test.fail[%s].last()}<>0", templateName, scenarioName + cpt));
        zabbixObjectRequest.getParams().put("priority", 3);
        return zabbixObjectRequest;
    }

    /**
     * Create filters and params to get or create a service
     *
     * @param serviceName      Service's name
     * @param serviceClusterId Id of the service cluster (parent)
     * @param triggerId        Id of the trigger (parent)
     * @return An object containing all of the filters and params
     */
    private ZabbixObjectRequest createServiceObjectRequest(String serviceName, Long serviceClusterId, Long triggerId) {
        ZabbixObjectRequest zabbixObjectRequest = new ZabbixObjectRequest();
        zabbixObjectRequest.setFilter(new HashMap<>());
        zabbixObjectRequest.getFilter().put("name", serviceName);
        zabbixObjectRequest.setParams(new HashMap<>());
        zabbixObjectRequest.getParams().put("name", serviceName);
        zabbixObjectRequest.getParams().put("algorithm", 1);
        zabbixObjectRequest.getParams().put("showsla", 0);
        zabbixObjectRequest.getParams().put("sortorder", 0);
        zabbixObjectRequest.getParams().put("parentid", serviceClusterId);
        zabbixObjectRequest.getParams().put("triggerid", triggerId);
        return zabbixObjectRequest;
    }

    /**
     * Get all SLAs from all services
     *
     * @return all SLAs from all services
     */
    public List<ServiceDTO> getAllSLAs() {
        List<ServiceDTO> serviceDTOS = new ArrayList<>();
        List<ServiceDAO> serviceDAOS = this.serviceRepository.findAll();
        serviceDAOS.forEach(s -> serviceDTOS.add(new ServiceDTO(s.getName(), s.getSla())));
        return serviceDTOS;
    }

    /**
     * Create a service (with his scenario, step and trigger)
     *
     * @param serviceRequestDTO Service to create
     * @param serviceClusterId  Service cluster Id
     * @param templateId        Template Id
     * @param templateName      Template name (used by the trigger)
     * @param applicationId     Application Id
     * @return Response class for the service created (with Scenario, step and trigger)
     */
    private ServiceResponseDTO createChildService(ServiceRequestDTO serviceRequestDTO, Long serviceClusterId, Long templateId, String templateName, Long applicationId, Integer cpt) throws MultipleResultException {
        log.debug(String.format("Creating serviceDTO with name %s", serviceRequestDTO.getName()));

        // Creating scenario
        ZabbixObjectRequest scenarioZabbixObjectRequest = this.createScenarioObjectRequest(serviceRequestDTO.getScenarioName(), serviceRequestDTO.getStepName(), serviceRequestDTO.getUrl(), serviceRequestDTO.getStepStatusCode(), templateId, applicationId, cpt);
        Long scenarioId = this.zabbixService.getOrCreateItemId("httptest", "httptestid", "httptestids", scenarioZabbixObjectRequest.getFilter(), scenarioZabbixObjectRequest.getParams());

        // Creating trigger (this will create 2 triggers: 1 for "Zabbix server" and one for the template)
        ZabbixObjectRequest triggerZabbixObjectRequest = this.createTriggerObjectRequest(serviceRequestDTO.getTriggerName(), templateName, serviceRequestDTO.getScenarioName(), cpt);
        Long childTriggerId = this.zabbixService.getOrCreateItemId("trigger", "triggerid", "triggerids", triggerZabbixObjectRequest.getFilter(), triggerZabbixObjectRequest.getParams());
        // We need to get trigger parent (from "Zabbix server") for the services to change SLA
        Map<String, String> filterTriggerParent = new HashMap<>();
        filterTriggerParent.put("templateid", childTriggerId.toString());
        Long triggerId = this.zabbixService.getItemId("trigger", "triggerid", filterTriggerParent);

        // Creating serviceDTO params. ServiceDTO can not be created with "showsla" to 1 so we need to update it afterwards
        ZabbixObjectRequest serviceZabbixObjectRequest = this.createServiceObjectRequest(serviceRequestDTO.getName(), serviceClusterId, triggerId);
        Long serviceId = this.zabbixService.getOrCreateItemId("service", "serviceid", "serviceids", serviceZabbixObjectRequest.getFilter(), serviceZabbixObjectRequest.getParams());
        // Updating the serviceDTO to show SLA
        Map<String, Object> serviceUpdateParams = new HashMap<>();
        serviceUpdateParams.put("serviceid", serviceId);
        serviceUpdateParams.put("showsla", 1);
        this.zabbixService.updateItem("service", serviceUpdateParams);

        // Creating response
        ServiceResponseDTO serviceResponseDTO = new ServiceResponseDTO();
        serviceResponseDTO.setScenarioId(scenarioId);
        serviceResponseDTO.setServiceId(serviceId);
        serviceResponseDTO.setTriggerId(triggerId);

        return serviceResponseDTO;
    }

    /**
     * Creation of all services inside template object
     *
     * @param templateRequestDTO Template containing all services to create
     * @return Response class containing all created Ids
     */
    public TemplateResponseDTO monitoring(TemplateRequestDTO templateRequestDTO) throws MultipleResultException {
        // We need to login before using Zabbix' API
        this.zabbixService.login(this.applicationProperties.getZabbix().getUser(), this.applicationProperties.getZabbix().getPassword());

        // Handling templateDTO: We create the templateDTO if it does not exist
        ZabbixObjectRequest templateZabbixObjectRequest = this.createTemplateObjectRequest(templateRequestDTO.getTemplateName(), templateRequestDTO.getGroupId(), templateRequestDTO.getHostId());
        Long templateId = this.zabbixService.getOrCreateItemId("template", "templateid", "templateids", templateZabbixObjectRequest.getFilter(), templateZabbixObjectRequest.getParams());

        // Handling application
        ZabbixObjectRequest applicationZabbixObjectRequest = this.createApplicationObjectRequest(templateRequestDTO.getApplicationName(), templateId);
        Long applicationId = this.zabbixService.getOrCreateItemId("application", "applicationid", "applicationids", applicationZabbixObjectRequest.getFilter(), applicationZabbixObjectRequest.getParams());

        // Handling serviceDTOS cluster
        ZabbixObjectRequest servicesClusterZabbixObjectRequest = this.createServicesClusterObjectRequest(this.applicationProperties.getZabbix().getServiceCluster());
        Long serviceClusterId = this.zabbixService.getOrCreateItemId("service", "serviceid", "serviceids", servicesClusterZabbixObjectRequest.getFilter(), servicesClusterZabbixObjectRequest.getParams());

        // Creating response
        TemplateResponseDTO templateResponseDTO = new TemplateResponseDTO();
        templateResponseDTO.setTemplateId(templateId);
        templateResponseDTO.setApplicationId(applicationId);
        templateResponseDTO.setServiceClusterId(serviceClusterId);
        // Creating each service
        Integer cpt = 0;
        List<ServiceResponseDTO> servicesResponse = new ArrayList<>();
        for (ServiceRequestDTO service : templateRequestDTO.getServices()) {
            servicesResponse.add(this.createChildService(service, serviceClusterId, templateId, templateRequestDTO.getTemplateName(), applicationId, cpt));
            cpt++;
        }
        templateResponseDTO.setServices(servicesResponse);

        return templateResponseDTO;
    }

    /**
     * Scheduler to update the h2 in-memory database with zabbix services and their SLAs
     * This scheduler is launched on spring start up
     */
    //@EventListener(ApplicationReadyEvent.class)
    //@Scheduled(cron = "${application.zabbix.scheduler.second} ${application.zabbix.scheduler.minute} ${application.zabbix.scheduler.hour} ${application.zabbix.scheduler.day-of-month} ${application.zabbix.scheduler.month} ${application.zabbix.scheduler.day-of-week}")
    public void refreshSLA() {
        log.debug("Refreshing SLAs");
        Instant startInstant = Instant.now().minus(this.applicationProperties.getZabbix().getScheduler().getDayInterval(), ChronoUnit.DAYS);
        Instant endInstant = Instant.now();

        // We need to login before using Zabbix' API
        this.zabbixService.login(this.applicationProperties.getZabbix().getUser(), this.applicationProperties.getZabbix().getPassword());
        log.debug(String.format("Getting all Slas for children of %s between %s and %s", this.applicationProperties.getZabbix().getServiceCluster(), Date.from(startInstant), Date.from(endInstant)));
        List<ServiceSla> serviceSlaList = this.zabbixService.getServicesWithSla(this.applicationProperties.getZabbix().getServiceCluster(), startInstant.getEpochSecond(), endInstant.getEpochSecond());
        log.debug("Slas found:");
        if (!serviceSlaList.isEmpty()) {
            serviceSlaList.forEach(s -> log.debug(s.toString()));
        } else {
            log.debug("none");
        }

        List<ServiceDAO> serviceDAOS = new ArrayList<>();
        serviceSlaList.forEach(s -> serviceDAOS.add(new ServiceDAO(s.getName(), s.getSla())));
        if (!serviceDAOS.isEmpty()) {
            log.debug(String.format("Persisting %s services", serviceDAOS.size()));
            this.serviceRepository.saveAll(serviceDAOS);
        }
    }
}
