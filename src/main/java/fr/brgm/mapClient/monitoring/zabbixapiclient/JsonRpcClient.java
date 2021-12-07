package fr.brgm.mapClient.monitoring.zabbixapiclient;

import com.fasterxml.jackson.databind.JsonNode;
import fr.brgm.mapClient.monitoring.zabbixapiclient.api.request.ApiGenericRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Simple JsonRpcClient to contact Zabbix server
 */
public class JsonRpcClient {

    private final static Log log = LogFactory.getLog(JsonRpcClient.class);

    /**
     * Resttemplate to perform http calls
     */
    private final RestTemplate restTemplate;

    /**
     * URL to Zabbix
     */
    private final String url;

    /**
     * Auth token used by Zabbix.
     * We first need to login to use Zabbix API
     */
    private String auth;

    /**
     * Id used in Zabbix requests.
     * It automatically increments before each requests
     */
    private Long currentId = 1L;

    /**
     * Create a ClientHttpRequestFactory used by RestTemplate
     *
     * @return ClientHttpRequestFactory
     */
    private ClientHttpRequestFactory getClientHttpRequestFactory() {
        int timeout = 5000;
        HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        clientHttpRequestFactory.setConnectTimeout(timeout);
        return clientHttpRequestFactory;
    }

    /**
     * Initializing JsonRpcClient with URL
     *
     * @param url ServiceDTO URL
     */
    public JsonRpcClient(String url) {
        this.restTemplate = new RestTemplate(getClientHttpRequestFactory());
        this.url = url;
    }

    /**
     * Login on Zabbix API (login occurs on startup to avoid multiple logins)
     *
     * @param user     User name
     * @param password User password
     */
    public void login(String user, String password) {
        this.auth = null;
        ApiGenericRequest request = new ApiGenericRequest();
        request.setMethod("user.login");
        request.addParamEntry("user", user);
        request.addParamEntry("password", password);
        request.setId(this.currentId);
        this.currentId++;

        HttpEntity<ApiGenericRequest> apiGenericRequestHttpEntity = new HttpEntity<>(request);
        JsonNode nodeResponse = this.restTemplate.postForObject(this.url, apiGenericRequestHttpEntity, JsonNode.class);
        this.auth = nodeResponse.get("result").asText();
    }

    /**
     * Execute a generic Request
     *
     * @param apiGenericRequest The request body
     * @return The response corresponding to the body
     */
    public JsonNode execute(ApiGenericRequest apiGenericRequest) {
        apiGenericRequest.setAuth(this.auth);
        apiGenericRequest.setId(this.currentId);
        this.currentId++;
        log.debug(String.format("Call restTemplate with request: %s", apiGenericRequest.toString()));
        HttpEntity<ApiGenericRequest> apiGenericRequestHttpEntity = new HttpEntity<>(apiGenericRequest);
        JsonNode nodeResponse = this.restTemplate.postForObject(this.url, apiGenericRequestHttpEntity, JsonNode.class);
        log.debug(String.format("Call restTemplate with response: %s", nodeResponse.toString()));
        return nodeResponse;
    }
}
