package fr.brgm.mapClient.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.monitoring.zabbixapiclient.JsonRpcClient;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class ApplicationConfiguration {

    private final ApplicationProperties applicationProperties;

    @Bean
    public JsonRpcClient jsonRpcClient() {
        return new JsonRpcClient(applicationProperties.getZabbix().getUrl());
    }

    @Bean
    public ObjectMapper m49Mapper() {
        return new ObjectMapper();
    }
}
