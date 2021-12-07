package fr.brgm.mapClient.monitoring.zabbixapiclient.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class Step {

    private String name;
    private Integer no;
    private String url;
    private String required;
    @JsonProperty("status_codes")
    private String statusCodes;
}
