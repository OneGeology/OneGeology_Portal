package fr.brgm.mapClient.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@ConfigurationProperties(prefix = "wms-validation", ignoreUnknownFields = false)
@Getter
@Setter
@Validated
public class WmsValidationProperties {

    @Getter
    @Setter
    public static class MustContainType {

        private Boolean conditional;

        @NotEmpty
        private String name;

        private List<String> values;

    }

    @Getter
    @Setter
    public static class MustContain {

        @NotNull
        @Valid
        private MustContainType geographicArea;

        @NotNull
        @Valid
        private MustContainType subarea;

        @NotNull
        @Valid
        private MustContainType dataProvider;

        @NotNull
        @Valid
        private MustContainType serviceProvider;

        @NotNull
        @Valid
        private MustContainType date;

        @NotNull
        @Valid
        private MustContainType topic;
    }

    @Getter
    @Setter
    public static class ChildLayerKeywords {

        @NotEmpty
        private List<String> mandatory;

        @NotNull
        @Valid
        private MustContain mustContain;

    }

    @Valid
    private final ChildLayerKeywords childLayerKeywords = new ChildLayerKeywords();

}
