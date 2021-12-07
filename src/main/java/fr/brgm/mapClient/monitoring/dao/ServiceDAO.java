package fr.brgm.mapClient.monitoring.dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Entity service stocked in h2 in-memory database
 */
@Entity
@Table(name = "service")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDAO {

    /**
     * Service's name
     */
    @Id
    @Column(name = "name")
    private String name;

    /**
     * Service's SLA
     */
    @Column(name = "sla", nullable = false)
    private Float sla;
}
