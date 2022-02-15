package fr.brgm.mapClient;

import fr.brgm.mapClient.config.properties.ApplicationProperties;
import fr.brgm.mapClient.config.properties.WmsValidationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan
@EnableScheduling
@EnableConfigurationProperties({
        ApplicationProperties.class,
        WmsValidationProperties.class
})
public class SpringBootAppStart extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootAppStart.class, args);
    }
}
