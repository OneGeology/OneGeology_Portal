package fr.brgm.mapClient.monitoring.zabbixapiclient.api.request;

import lombok.Data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Data
public class ApiGenericRequest {

    private String jsonrpc = "2.0";
    private String method;
    private Long id;
    private String auth;
    private Map<String, Object> params;

    public void addParamEntry(String key, Object value) {
        if (this.params == null) {
            this.params = new HashMap<>();
        }

        this.params.put(key, value);
    }

    @Override
    public String toString() {
        return "ApiGenericRequest{" +
                "jsonrpc='" + jsonrpc + '\'' +
                ", method='" + method + '\'' +
                ", id=" + id +
                ", auth='" + auth + '\'' +
                ", params=" + Arrays.toString(this.params.entrySet().toArray()) +
                '}';
    }
}
