package fr.brgm.mapClient.monitoring.zabbixapiclient.api;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class ZabbixObjectRequest {

    private Map<String, String> filter;
    private Map<String, Object> params;
}
