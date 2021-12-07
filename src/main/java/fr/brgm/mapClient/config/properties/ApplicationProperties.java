package fr.brgm.mapClient.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
@Getter
@Setter
@Validated
public class ApplicationProperties {

    @Getter
    @Setter
    public static class Scheduler {

        @NotEmpty
        private String second;
        @NotEmpty
        private String minute;
        @NotEmpty
        private String hour;
        @NotEmpty
        private String dayOfMonth;
        @NotEmpty
        private String month;
        @NotEmpty
        private String dayOfWeek;
        @NotNull
        private Long dayInterval;
    }

    @Getter
    @Setter
    public static class Zabbix {

        @NotEmpty
        private String proxy;
        @NotEmpty
        private String url;
        @NotEmpty
        private String user;
        @NotEmpty
        private String password;
        @NotEmpty
        private String serviceCluster;
        @NotEmpty
        private String scenarioDelay;
        @NotNull
        private Scheduler scheduler;
    }

    @Getter
    @Setter
    public static class OgcTools {

        @NotEmpty
        private String url;

        @NotEmpty
        private String getWfsUrl;

        @NotEmpty
        private String getSldUrl;

    }

    @Getter
    @Setter
    public static class Vocabulary {
        @NotEmpty
        private String name;
        private String url;
        private String mappingUrl;
        private Boolean isDefault = false;
    }

    @Valid
    private final Zabbix zabbix = new Zabbix();
    @Valid
    private final OgcTools ogcTools = new OgcTools();

    @NotEmpty
    private String cesiumExceptionUrl;

    private List<Vocabulary> vocabularies = new ArrayList<>();

}
