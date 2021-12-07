package fr.brgm.mapClient.monitoring.zabbixapiclient.api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Interval {

    private Long from;
    private Long to;
}
