package fr.brgm.mapClient.monitoring.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@ToString
public class MonitoringDTO {

    private Long dayInterval;
    private List<ServiceDTO> monitoring;
}
