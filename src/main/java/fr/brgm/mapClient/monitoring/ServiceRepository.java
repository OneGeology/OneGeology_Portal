package fr.brgm.mapClient.monitoring;

import fr.brgm.mapClient.monitoring.dao.ServiceDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * H2 in memory database to get and save SLA from zabbix serviceDTOS
 */
@Repository
public interface ServiceRepository extends JpaRepository<ServiceDAO, Long> {
}
