package fr.brgm.mapClient.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class WmsRestClientConfiguration {

    @Bean
    public RestTemplate wmsRestTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
