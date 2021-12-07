package fr.brgm.mapClient.monitoring.zabbixapiclient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.Interval;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.ServiceSla;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.exception.MultipleResultException;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.request.ApiGenericRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ServiceDTO used to handle Zabbix item
 */
@Service
@AllArgsConstructor
public class ZabbixService {

    /**
     * FIRST_ELEMENT = 0
     */
    private static final int FIRST_ELEMENT = 0;

    /**
     * Json RPC client
     */
    private final JsonRpcClient jsonRpcClient;

    /**
     * Login on Zabbix API (login occurs on startup to avoid multiple logins)
     * @param user User name
     * @param password User password
     */
    public void login(String user, String password) {
        this.jsonRpcClient.login(user, password);
    }

    /**
     *
     * @param businessItem Zabbix' name of the item
     * @param output Field of the item we need (i.e. xxxid)
     * @param filter Key value to add filters to the Get request
     * @return Id of the existing item or null if it does not exist
     */
    public Long getItemId(String businessItem, String output, Map<String, String> filter) throws MultipleResultException {
        ApiGenericRequest apiGenericRequest = new ApiGenericRequest();
        apiGenericRequest.setMethod(String.format("%s.get", businessItem));
        apiGenericRequest.addParamEntry("output", output);
        apiGenericRequest.addParamEntry("filter", filter);
        JsonNode response = this.jsonRpcClient.execute(apiGenericRequest);
        if(response == null ||
                response.get("result") == null ||
                response.get("result").get(FIRST_ELEMENT) == null ||
                response.get("result").get(FIRST_ELEMENT).get(output) == null) {
            return null;
        }
        ArrayNode node = (ArrayNode) response.get("result");
        if(node.size() > 1) {
            throw new MultipleResultException(String.format("Get request on %s returned more than one result.", businessItem));
        }
        return response.get("result").get(FIRST_ELEMENT).get(output).asLong();
    }

    /**
     * Create an item in Zabbix
     * @param businessItem Zabbix' name of the item
     * @param params Params we need to create the item
     * @param outputResult Field we need to get created item id (i.e. xxxids)
     * @return Id of the created item
     */
    private Long createItem(String businessItem, Map<String, Object> params, String outputResult) {
        ApiGenericRequest templateRequest = new ApiGenericRequest();
        templateRequest.setMethod(String.format("%s.create", businessItem));
        params.forEach(templateRequest::addParamEntry);
        JsonNode templateResponse = this.jsonRpcClient.execute(templateRequest);
        return templateResponse.get("result").get(outputResult).get(FIRST_ELEMENT).asLong();
    }

    /**
     * Get an existing item or create it if it does not exist
     * @param businessItem Zabbix' name of the item
     * @param output Field of the item we need (i.e. xxxid)
     * @param outputResult Field we need to get created item id (i.e. xxxids)
     * @param filter Key: Field used to filter while searching, Value: Value used to search
     * @param params Params we need to create the item
     * @return Id of the resulting item
     */
    public Long getOrCreateItemId(String businessItem, String output, String outputResult, Map<String, String> filter, Map<String, Object> params) throws MultipleResultException {
        // Checking if template already exists
        Long existingId = this.getItemId(businessItem, output, filter);
        if(existingId != null) {
            return existingId;
        }

        // If not create it
        return this.createItem(businessItem, params, outputResult);
    }

    /**
     * Update an existing item
     * @param businessItem Zabbix' name of the item
     * @param params Params we need to update the item (itemid and the changes)
     */
    public void updateItem(String businessItem, Map<String, Object> params) {
        ApiGenericRequest templateRequest = new ApiGenericRequest();
        templateRequest.setMethod(String.format("%s.update", businessItem));
        params.forEach(templateRequest::addParamEntry);
        this.jsonRpcClient.execute(templateRequest);
    }

    /**
     * Getting all services with their SLAs between 2 dates
     * @param serviceClusterName Parent name of all services
     * @param startTimestamp Timestamp to start the search
     * @param endTimestamp Timestamp to end the search
     * @return All services with their SLAs between 2 dates
     */
    public List<ServiceSla> getServicesWithSla(String serviceClusterName, Long startTimestamp, Long endTimestamp) {
        Map<String, String> serviceClusterFilter = new HashMap<>();
        serviceClusterFilter.put("name", serviceClusterName);
        // Get all service cluster id
        ApiGenericRequest serviceClusterRequest = new ApiGenericRequest();
        serviceClusterRequest.setMethod("service.get");
        serviceClusterRequest.addParamEntry("selectDependencies", "extend");
        serviceClusterRequest.addParamEntry("filter", serviceClusterFilter);
        JsonNode serviceClusterResponse = this.jsonRpcClient.execute(serviceClusterRequest);
        if (serviceClusterResponse == null ||
                serviceClusterResponse.get("result") == null ||
                serviceClusterResponse.get("result").size() == 0) {
            return new ArrayList<>();
        }
        List<Long> serviceIds = new ArrayList<>();
        // For each service
        for (JsonNode service : serviceClusterResponse.get("result")) {
            if (service != null && service.get("dependencies") != null) {
                // For each dependency (child service)
                for (JsonNode dependency : service.get("dependencies")) {
                    // We get all serviceDTOS ids
                    serviceIds.add(dependency.get("servicedownid").asLong());
                }
            }
        }

        // Now we have all serviceDTOS ids, we need their names
        Map<String, Object> servicesFilter = new HashMap<>();
        servicesFilter.put("serviceid", serviceIds);
        ApiGenericRequest allServicesRequest = new ApiGenericRequest();
        allServicesRequest.setMethod("service.get");
        allServicesRequest.addParamEntry("output", Arrays.asList("serviceid", "name"));
        allServicesRequest.addParamEntry("filter", servicesFilter);
        JsonNode allServicesResponse = this.jsonRpcClient.execute(allServicesRequest);

        // And their SLAs
        ApiGenericRequest allSlaRequest = new ApiGenericRequest();
        allSlaRequest.setMethod("service.getsla");
        allSlaRequest.addParamEntry("serviceids", serviceIds);
        allSlaRequest.addParamEntry("intervals", Collections.singletonList(new Interval(startTimestamp, endTimestamp)));
        JsonNode allSlaResponse = this.jsonRpcClient.execute(allSlaRequest);

        List<ServiceSla> serviceSlas = new ArrayList<>();
        // Getting back id, name and sla for each service
        if(allServicesResponse == null || allServicesResponse.get("result") == null) {
            return serviceSlas;
        }
        for(JsonNode service : allServicesResponse.get("result")) {
            Long serviceId = service.get("serviceid").asLong();
            ServiceSla serviceSla = new ServiceSla();
            serviceSla.setServiceId(serviceId);
            serviceSla.setName(service.get("name").asText());
            serviceSla.setSla(Float.valueOf(allSlaResponse.get("result").get(serviceId.toString()).get("sla").get(FIRST_ELEMENT).get("sla").asText()));
            serviceSlas.add(serviceSla);
        }

        return serviceSlas;
    }
}
