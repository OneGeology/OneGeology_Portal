package fr.brgm.mapClient.monitoring.zabbixapiclient.api;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class ServiceSla {

    private Long serviceId;

    private String name;

    private Float sla;
}
