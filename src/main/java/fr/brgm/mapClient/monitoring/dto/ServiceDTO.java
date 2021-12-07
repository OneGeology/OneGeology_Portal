package fr.brgm.mapClient.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity service stocked in h2 in-memory database
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {

    /**
     * Service's name
     */
    private String name;

    /**
     * Service's SLA
     */
    private Float sla;
}
